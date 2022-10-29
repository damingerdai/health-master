package routers

import (
	"github.com/damingerdai/health-master/internal/api"
	"github.com/damingerdai/health-master/internal/middleware"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.New()
	r.Use(middleware.AccessLog())

	r.Any("ping", func(ctx *gin.Context) {
		ctx.JSON(200, "pong")
	})

	apiV1 := r.Group("/api/v1")
	apiV1.Use(middleware.JWT())
	{
		apiV1.POST("/user", api.CreateUser)
		apiV1.GET("/user", api.GetCurrentUser)
		apiV1.GET("/user/:id", api.GetUser)

		apiV1.POST("/token", api.CreateToken)

		apiV1.POST("/user-blood-pressure", api.CreateUserBloodPressure)
		apiV1.GET("/user-blood-pressures", api.ListBloodPressures)

	}

	return r
}
