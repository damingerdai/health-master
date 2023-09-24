package api

import (
	"github.com/gin-gonic/gin"
)

// Ping godoc
//
//	@Summary		ping
//	@Description	health check
//	@Tags			ping
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	string
//	@Router			/ping [get]
func Pong(c *gin.Context) {
	c.JSON(200, "pong")
}
