package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func CreateUsersTemperatures(c *gin.Context) {
	var userTemperature model.UserTemperature
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userTemperature); err != nil {
		global.Logger.Error("create user temperature with invalid params", zap.Error(err))
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		service := service.New(conn, global.Logger)
		user, err := service.UserService.Find(c, userTemperature.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = service.UserTemperatureService.Create(c, &userTemperature)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		resp.ToErrorResponse(errcode.CreateUserTemperatureError)
	} else {
		resp.ToResponse(userTemperature)
	}
}

func GetUsersTemperatures(c *gin.Context) {
	id := c.Param("id")
	resp := response.NewResponse(c)
	var userTemperature *model.UserTemperature
	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		service := service.New(conn, global.Logger)
		ut, err := service.UserTemperatureService.Find(c, id)
		if err != nil {
			return err
		}
		userTemperature = ut
		return nil
	})
	if err != nil {
		resp.ToErrorResponse(errcode.GetUserTemperatureError)
	} else {
		resp.ToResponse(userTemperature)
	}
}

func ListUsersTemperatures(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	userId := c.Query("userId")
	if userId == "" {
		userIdInContext, exists := c.Get(contants.UserContext)
		if !exists {
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		userId, _ = userIdInContext.(string)
		if userId == "" {
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
	}
	uts, err := service.UserTemperatureService.List(c, userId)
	if err != nil {
		resp.ToErrorResponse(errcode.ListUserTemperatureError)
	} else {
		resp.ToResponse(uts)
	}

}
