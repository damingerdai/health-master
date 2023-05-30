package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateUser(c *gin.Context) {
	var err error
	var user model.User
	res := response.NewResponse(c)
	err = c.ShouldBindJSON(&user)
	if err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	global.DBEngine.Transaction(func(tx *gorm.DB) error {
		var err error
		service := service.New(tx)
		userService := service.UserService
		fullUser, err := userService.Create(&user)
		if err != nil {
			global.Logger.Error(err.Error())
			res.ToErrorResponse(errcode.CreateUserError)
			return err
		}
		res.ToResponse(fullUser)

		return nil
	})

}

func GetUser(c *gin.Context) {
	var res = response.NewResponse(c)
	var id = c.Param("id")
	services := service.New(global.DBEngine)
	userService := services.UserService

	user, err := userService.Find(id)
	if err != nil {
		res.ToErrorResponse(errcode.ServerError)
		return
	}
	res.ToResponse(user)

}

func GetCurrentUser(c *gin.Context) {
	var response = response.NewResponse(c)
	var services = service.New(global.DBEngine)
	userId := c.GetString("UserId")
	if userId == "" {
		var token string
		if s, exist := c.GetQuery("Authorization"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
		}
		if token == "" {
			response.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}

		userService := services.UserService
		tokenService := services.TokenService

		claims, err := tokenService.ParseToken(token[7:])
		if err != nil {
			response.ToErrorResponse(errcode.UnauthorizedTokenError)
			return
		}
		userId := claims.UserId
		user, err := userService.Find(userId)
		if err != nil {
			response.ToErrorResponse(errcode.UnauthorizedTokenError)
			return
		}
		if user == nil {
			response.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		user.Password = ""
		response.ToResponse(user)

	} else {
		userService := services.UserService
		user, err := userService.Find(userId)
		if err != nil {
			response.ToErrorResponse(errcode.ServerError)
			return
		}
		user.Password = ""
		response.ToResponse(user)
	}
}
