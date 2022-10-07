package routers

import (
	"github.com/damingerdai/health-master/internal/api"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.New()

	r.Any("ping", func(ctx *gin.Context) {
		ctx.JSON(200, "pong")
	})

	r.POST("user", api.CreateUser)
	r.GET("user/:id", api.GetUser)

	return r
}
