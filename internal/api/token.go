package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func CreateToken(c *gin.Context) {
	username := c.GetHeader("username")
	password := c.GetHeader("password")
	response := response.NewResponse(c)
	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository)

	userToken, err := tokenService.CreateToken(username, password)
	if err != nil {
		response.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	response.ToTokenResponse(userToken)
}
