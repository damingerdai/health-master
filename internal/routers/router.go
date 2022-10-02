package routers

import "github.com/gin-gonic/gin"

func NewRouter() *gin.Engine {
	r := gin.New()

	r.Any("ping", func(ctx *gin.Context) {
		ctx.JSON(200, "pong")
	})

	return r
}
