package api

import (
	"errors"
	"fmt"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateUserBloodPressure(c *gin.Context) {
	var userBloodPressure model.UserBloodPressure
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userBloodPressure); err != nil {
		fmt.Println(err)
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := global.DBEngine.Transaction(func(tx *gorm.DB) error {
		service := service.New(tx)

		user, err := service.UserService.Find(userBloodPressure.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = service.UserBloodPressureService.Create(&userBloodPressure)
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
	userBloodPressureService := service.UserBloodPressureService
	ubps, err := userBloodPressureService.ListByUserId(userId)
	if err != nil {
		resp.ToErrorResponse(errcode.ListUserBloodPressureError)
	} else {
		resp.ToResponse(ubps)
	}

}
