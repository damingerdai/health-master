package routers

import (
	"time"

	"github.com/damingerdai/health-master/internal/api"
	"github.com/damingerdai/health-master/internal/middleware"
	"github.com/damingerdai/health-master/pkg/limiter"
	"github.com/gin-gonic/gin"
)

var rule = limiter.LimiterBucketRule{
	Key:          "/auth",
	FillInterval: time.Second,
	Capacity:     10,
	Quantum:      10,
}

var methodLimiters = limiter.NewMethodLimiter().AddBuckets(rule)

func NewRouter() *gin.Engine {
	r := gin.New()
	r.Use(middleware.AccessLog())

	r.Any("ping", func(ctx *gin.Context) {
		ctx.JSON(200, "pong")
	})

	apiV1 := r.Group("/api/v1")
	apiV1.Use(middleware.JWT())
	apiV1.Use(middleware.RateLimiter(methodLimiters))
	{
		apiV1.POST("/user", api.CreateUser)
		apiV1.GET("/user", api.GetCurrentUser)
		apiV1.GET("/user/:id", api.GetUser)

		apiV1.GET("/token", api.ParseToken)
		apiV1.POST("/token", api.CreateToken)

		apiV1.POST("/user-blood-pressure", api.CreateUserBloodPressure)
		apiV1.DELETE("/user-blood-pressure/:id", api.DeleteBloodPressure)
		apiV1.GET("/user-blood-pressures", api.ListBloodPressures)

		apiV1.GET("/roles", api.ListRoles)

	}

	return r
}
