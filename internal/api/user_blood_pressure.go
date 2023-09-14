package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func CreateUserBloodPressure(c *gin.Context) {
	var userBloodPressure model.UserBloodPressure
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userBloodPressure); err != nil {
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		service := service.New(conn)
		user, err := service.UserService.Find(c, userBloodPressure.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = service.UserBloodPressureService.Create(c, &userBloodPressure)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		resp.ToErrorResponse(errcode.CreateUserBloodPressureError)
	} else {
		resp.ToResponse(userBloodPressure)
	}
}

func ListBloodPressures(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine)
	userId := c.GetString("UserId")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	userBloodPressureService := service.UserBloodPressureService
	ubps, err := userBloodPressureService.ListByUserId(c, userId, page, limit)
	if err != nil {
		resp.ToErrorResponse(errcode.ListUserBloodPressureError)
	} else {
		resp.ToResponse(ubps)
	}

}

func DeleteBloodPressure(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine)
	id := c.Params.ByName("id")
	err := service.UserBloodPressureService.Delete(c, id)
	if err != nil {
		resp.ToErrorResponseWithError(errcode.DeleteUserBloodPressureError, err)
	} else {
		resp.ToResponse(gin.H{"success": true})
	}
}
