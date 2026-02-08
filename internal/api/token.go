package api

import (
	"errors"
	"strings"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

// Create a token godoc
//
//	@Summary		create a token
//	@Description	create a new token
//	@Tags			token
//	@Accept			json
//	@Produce		json
//	@Param			username	header		string			true	"username"
//	@Param			password	header		string			true	"password"
//	@Success		200			{object}	model.UserToken	"success"
//	@Failure		400			{object}	errcode.Error	"bad request error"
//	@Failure		500			{object}	errcode.Error	"internal server error"
//	@Router			/api/v1/token [post]
func CreateToken(c *gin.Context) {
	response := response.NewResponse(c)
	username := c.GetHeader("username")
	if len(username) == 0 {
		global.Logger.Error("username is empty")
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	password := c.GetHeader("password")
	if len(password) == 0 {
		global.Logger.Error("password is empty")
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenRepository := repository.NewTokenRecordRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository, tokenRepository)

	userToken, err := tokenService.CreateToken(c, username, password)
	if err != nil {
		global.Logger.Error("fail to create token", zap.Error(err))
		response.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	response.ToTokenResponse(userToken)
}

// parse a token godoc
//
//	@Summary		parse a token
//	@Description	parse a exsited token
//	@Tags			token
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header		string			true	"Insert your access token"	default(Bearer <Add access token here>)
//	@Success		200				{object}	model.User		"sucess"
//	@Failure		400				{object}	errcode.Error	"bad request error"
//	@Failure		500				{object}	errcode.Error	"internal server error"
//	@Router			/api/v1/token [get]
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
	srv := service.New(global.DBEngine, global.Logger)
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
	user, err := userService.Find(c, claims.UserId)
	if err != nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	user.Password = ""
	res.ToResponse(user)
}

func GetTmpToken(c *gin.Context) {
	res := response.NewResponse(c)

	var token string
	if s, exist := c.GetQuery("accessToken"); exist {
		token = s
	} else {
		token = c.GetHeader("Authorization")
	}
	token = strings.TrimPrefix(token, "Bearer ")

	srv := service.New(global.DBEngine, global.Logger)
	tokenService := srv.TokenService
	userService := srv.UserService
	claims, err := tokenService.ParseToken(token)
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
	user, err := userService.Find(c, claims.UserId)
	if err != nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	now := time.Now()
	expireTime := now.Add(1 * time.Minute)
	userToken, err := tokenService.CreateTmpToken(c, user, expireTime)
	if err != nil {
		res.ToErrorResponse(errcode.ServerError)
	}
	res.ToResponse(userToken)
}
