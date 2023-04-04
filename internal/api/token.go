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
	response := response.NewResponse(c)
	username := c.GetHeader("username")
	if len(username) == 0 {
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	password := c.GetHeader("password")
	if len(password) == 0 {
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository)

	userToken, err := tokenService.CreateToken(username, password)
	if err != nil {
		response.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	response.ToTokenResponse(userToken)
}
