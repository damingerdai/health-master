package middleware

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// Both keys use the same Redis cluster hash slot. Checking the lockout and
// consuming a request are atomic across application instances.
const passwordChangeAllowScript = `
local failures = tonumber(redis.call('GET', KEYS[2]) or '0')
if failures >= 5 then
    return math.max(redis.call('TTL', KEYS[2]), 1)
end
local requests = redis.call('INCR', KEYS[1])
if requests == 1 then redis.call('EXPIRE', KEYS[1], 60) end
if requests > 5 then
    return math.max(redis.call('TTL', KEYS[1]), 1)
end
return 0
`

// Count failures within a 15-minute window; the fifth failure starts a full
// 15-minute lockout. Further in-flight failures do not extend that lockout.
const passwordChangeFailureScript = `
local failures = redis.call('INCR', KEYS[1])
if failures == 1 or failures == 5 then
    redis.call('EXPIRE', KEYS[1], 900)
end
return failures
`

type passwordChangeAttempts interface {
	allow(context.Context, string) (int, error)
	finish(context.Context, string, bool) error
}

type redisPasswordChangeAttempts struct {
	client *redis.Client
}

func passwordChangeKeys(userID string) (string, string) {
	prefix := "password-change:{" + userID + "}:"
	return prefix + "requests", prefix + "failures"
}

func (s redisPasswordChangeAttempts) allow(ctx context.Context, userID string) (int, error) {
	if s.client == nil {
		return 0, errors.New("password change limiter Redis client unavailable")
	}
	requests, failures := passwordChangeKeys(userID)
	return s.client.Eval(ctx, passwordChangeAllowScript, []string{requests, failures}).Int()
}

func (s redisPasswordChangeAttempts) finish(ctx context.Context, userID string, success bool) error {
	_, failures := passwordChangeKeys(userID)
	if success {
		// Keep the request counter: success must not bypass the rate limit.
		return s.client.Del(ctx, failures).Err()
	}
	return s.client.Eval(ctx, passwordChangeFailureScript, []string{failures}).Err()
}

// PasswordChangeLimiter must run after JWT so limits are keyed by verified user ID.
func PasswordChangeLimiter(client *redis.Client, logger *zap.Logger) gin.HandlerFunc {
	return passwordChangeLimiter(redisPasswordChangeAttempts{client: client}, logger)
}

func passwordChangeLimiter(attempts passwordChangeAttempts, logger *zap.Logger) gin.HandlerFunc {
	if logger == nil {
		logger = zap.NewNop()
	}
	return func(c *gin.Context) {
		userID := c.GetString(contants.UserContext)
		if userID == "" {
			response.NewResponse(c).ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			c.Abort()
			return
		}
		ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
		retryAfter, err := attempts.allow(ctx, userID)
		cancel()
		if err != nil {
			logger.Error("failed to check password change limit", zap.String("user_id", userID), zap.Error(err))
			response.NewResponse(c).ToErrorResponse(errcode.ServerError)
			c.Abort()
			return
		}
		if retryAfter > 0 {
			c.Header("Retry-After", strconv.Itoa(retryAfter))
			response.NewResponse(c).ToErrorResponse(errcode.TooManyRequests)
			c.Abort()
			return
		}

		c.Next()

		success := c.Writer.Status() >= http.StatusOK && c.Writer.Status() < http.StatusMultipleChoices
		authFailed := false
		for _, e := range c.Errors {
			if errors.Is(e.Err, errcode.ErrInvalidCredentials) || errors.Is(e.Err, errcode.InvalidVerificationCode) {
				authFailed = true
				break
			}
		}
		if !success && !authFailed {
			return
		}
		// A caller disconnect must not erase a failed authentication attempt.
		ctx, cancel = context.WithTimeout(context.WithoutCancel(c.Request.Context()), 2*time.Second)
		defer cancel()
		if err := attempts.finish(ctx, userID, success); err != nil {
			logger.Error("failed to record password change outcome", zap.String("user_id", userID), zap.Error(err))
		}
	}
}
