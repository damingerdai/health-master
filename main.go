package main

import (
	"github.com/damingerdai/health-master/internal/logger"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	log := logger.NewLogger(logger.LevelInfo)
	log.Info("health master server ...")
	r.Run()
}
