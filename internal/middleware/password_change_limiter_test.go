package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type passwordAttemptsStub struct {
	retryAfter int
	err        error
	userID     string
	allowed    bool
	recorded   bool
	success    bool
}

func (s *passwordAttemptsStub) allow(_ context.Context, userID string) (int, error) {
	s.allowed = true
	s.userID = userID
	return s.retryAfter, s.err
}

func (s *passwordAttemptsStub) finish(ctx context.Context, userID string, success bool) error {
	if ctx.Err() != nil {
		return ctx.Err()
	}
	s.recorded = true
	s.success = success
	return nil
}

func TestPasswordChangeLimiter(t *testing.T) {
	for _, tc := range []struct {
		name                             string
		userID                           string
		retryAfter                       int
		storeErr                         error
		handlerStatus                    int
		handlerErr                       error
		wantStatus                       int
		wantRun, wantRecord, wantSuccess bool
	}{
		{name: "missing identity", wantStatus: 401},
		{name: "rate limited", userID: "alice", retryAfter: 60, wantStatus: 429},
		{name: "Redis unavailable", userID: "alice", storeErr: errors.New("unavailable"), wantStatus: 500},
		{name: "wrong password", userID: "alice", handlerStatus: 401, handlerErr: errcode.ErrInvalidCredentials, wantStatus: 401, wantRun: true, wantRecord: true},
		{name: "wrapped invalid TOTP", userID: "alice", handlerStatus: 400, handlerErr: fmt.Errorf("verify: %w", errcode.InvalidVerificationCode), wantStatus: 400, wantRun: true, wantRecord: true},
		{name: "missing TOTP", userID: "alice", handlerStatus: 401, handlerErr: errcode.ErrTwoFactorAuthenticationRequired, wantStatus: 401, wantRun: true},
		{name: "invalid input", userID: "alice", handlerStatus: 400, wantStatus: 400, wantRun: true},
		{name: "database failure", userID: "alice", handlerStatus: 500, handlerErr: errcode.ServerError, wantStatus: 500, wantRun: true},
		{name: "success", userID: "alice", handlerStatus: 200, wantStatus: 200, wantRun: true, wantRecord: true, wantSuccess: true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			store := &passwordAttemptsStub{retryAfter: tc.retryAfter, err: tc.storeErr}
			router := gin.New()
			ran := false
			router.PUT("/password", func(c *gin.Context) {
				c.Set(contants.UserContext, tc.userID)
			}, passwordChangeLimiter(store, nil), func(c *gin.Context) {
				ran = true
				if tc.handlerErr != nil {
					_ = c.Error(tc.handlerErr)
				}
				c.Status(tc.handlerStatus)
			})
			w := httptest.NewRecorder()
			router.ServeHTTP(w, httptest.NewRequest(http.MethodPut, "/password", nil))
			if w.Code != tc.wantStatus || ran != tc.wantRun {
				t.Fatalf("status=%d ran=%v; want %d %v", w.Code, ran, tc.wantStatus, tc.wantRun)
			}
			if store.recorded != tc.wantRecord || store.success != tc.wantSuccess {
				t.Fatalf("recorded=%v success=%v", store.recorded, store.success)
			}
			if store.userID != tc.userID {
				t.Fatalf("unexpected user ID %q", store.userID)
			}
			if tc.userID == "" && store.allowed {
				t.Fatal("queried limiter without authenticated identity")
			}
			if tc.retryAfter > 0 && w.Header().Get("Retry-After") != "60" {
				t.Fatal("missing Retry-After")
			}
		})
	}
}

func TestRedisPasswordChangeAttempts(t *testing.T) {
	addr := os.Getenv("HEALTH_MASTER_TEST_REDIS_ADDR")
	if addr == "" {
		t.Skip("set HEALTH_MASTER_TEST_REDIS_ADDR to run Redis Lua integration tests")
	}
	client := redis.NewClient(&redis.Options{Addr: addr})
	t.Cleanup(func() { client.Close() })
	store := redisPasswordChangeAttempts{client: client}
	ctx := context.Background()
	alice, bob := uuid.NewString(), uuid.NewString()
	ar, af := passwordChangeKeys(alice)
	br, bf := passwordChangeKeys(bob)
	t.Cleanup(func() { client.Del(ctx, ar, af, br, bf) })
	allow := func(user string, blocked bool) {
		t.Helper()
		retry, err := store.allow(ctx, user)
		if err != nil {
			t.Fatal(err)
		}
		if (retry > 0) != blocked {
			t.Fatalf("retry=%d blocked=%v", retry, blocked)
		}
	}
	for i := 0; i < 5; i++ {
		allow(alice, false)
	}
	allow(alice, true)
	allow(bob, false)
	if err := store.finish(ctx, alice, true); err != nil {
		t.Fatal(err)
	}
	allow(alice, true) // success cannot reset the request limit
	if ttl := client.TTL(ctx, ar).Val(); ttl <= 0 || ttl > time.Minute {
		t.Fatalf("request TTL %v", ttl)
	}
	if err := client.Del(ctx, ar).Err(); err != nil {
		t.Fatal(err)
	}
	allow(alice, false)
	for i := 0; i < 4; i++ {
		if err := store.finish(ctx, alice, false); err != nil {
			t.Fatal(err)
		}
	}
	allow(alice, false)
	if err := store.finish(ctx, alice, true); err != nil {
		t.Fatal(err)
	}
	if client.Exists(ctx, af).Val() != 0 {
		t.Fatal("success did not reset failures")
	}
	for i := 0; i < 5; i++ {
		if err := store.finish(ctx, alice, false); err != nil {
			t.Fatal(err)
		}
	}
	allow(alice, true)
	allow(bob, false)
	if ttl := client.TTL(ctx, af).Val(); ttl < 14*time.Minute || ttl > 15*time.Minute {
		t.Fatalf("lockout TTL %v", ttl)
	}
	if err := client.PExpire(ctx, af, time.Millisecond).Err(); err != nil {
		t.Fatal(err)
	}
	time.Sleep(10 * time.Millisecond)
	allow(alice, false)
}
