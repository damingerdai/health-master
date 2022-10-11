package api

import (
	"net/http"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/gin-gonic/gin"
)

func CreateToken(c *gin.Context) {
	username := c.GetHeader("username")
	password := c.GetHeader("password")

	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository)

	userToken, err := tokenService.CreateToken(username, password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": userToken})
}
