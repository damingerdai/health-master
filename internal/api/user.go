package api

import (
	"net/http"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var user model.User
	response := response.NewResponse(c)
	if err := c.ShouldBindJSON(&user); err != nil {
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	userService := service.NewUserService(repository.NewUserRepository(global.DBEngine))
	if err := userService.Create(&user); err != nil {
		response.ToErrorResponse(errcode.InvalidParams)
		return
	}
	user.CreatedAt = nil
	user.UpdatedAt = nil
	user.Password = ""
	c.JSON(http.StatusOK, user)
}

func GetUser(c *gin.Context) {
	var id = c.Param("id")

	userService := service.NewUserService(repository.NewUserRepository(global.DBEngine))

	user, err := userService.Find(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})

}

func GetCurrentUser(c *gin.Context) {
	var response = response.NewResponse(c)
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

		userRepository := repository.NewUserRepository(global.DBEngine)
		userService := service.NewUserService(userRepository)
		tokenService := service.NewTokenService(userRepository)

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
		userRepository := repository.NewUserRepository(global.DBEngine)
		userService := service.NewUserService(userRepository)
		user, err := userService.Find(userId)
		if err != nil {
			response.ToErrorResponse(errcode.ServerError)
			return
		}
		user.Password = ""
		response.ToResponse(user)
	}
}
