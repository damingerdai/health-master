package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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

func ParseToken(c *gin.Context) {
	res := response.NewResponse(c)

	var token string
	if s, exist := c.GetQuery("Authorization"); exist {
		token = s
	} else {
		token = c.GetHeader("Authorization")
	}

	if token == "" {
		res.ToErrorResponse(errcode.NotFoundAuthorization)
	}
	srv := service.New(global.DBEngine)
	tokenService := srv.TokenService
	userService := srv.UserService
	claims, err := tokenService.ParseToken(token[7:])
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			res.ToErrorResponse(errcode.UnauthorizedTokenTimeout)
		} else {
			res.ToErrorResponse(errcode.UnauthorizedTokenError)
		}
		return
	}
	if claims == nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	user, err := userService.Find(claims.UserId)
	if err != nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	user.Password = ""
	res.ToResponse(user)
}
