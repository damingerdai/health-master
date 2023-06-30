package middleware

import (
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/limiter"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func RateLimiter(l limiter.ILimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := l.Key(c)
		if bucket, ok := l.GetBucket(key); ok {
			count := bucket.TakeAvailable(1)
			if count == 0 {
				res := response.NewResponse(c)
				res.ToErrorResponse(errcode.TooManyRequests)
				c.Abort()
				return
			}
		}
	}
}
