package api

import (
	"errors"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

// create a user blood pressure godoc
//
//	@Summary		create a user blood pressure
//	@Description	create a user blood pressure
//	@Tags			user_blood_pressure
//	@Accept			json
//	@Produce		json
//	@Param			user_blood_pressure	body	model.UserBloodPressure	true	"create a user blood pressure"
//	@Security		BearerAuth
//	@Success		200	{object}	model.UserBloodPressure	"sucess"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/user_blood_pressure [post]
func CreateUserBloodPressure(c *gin.Context) {
	var userBloodPressure model.UserBloodPressure
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userBloodPressure); err != nil {
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		service := service.New(conn, global.Logger)
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

// list all user blood pressure for single user godoc
//
//	@Summary		list all user blood pressure for single user
//	@Description	list all user blood pressure for single user
//	@Tags			user_blood_pressure
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header	string	true	"Insert your access token"	default(Bearer <Add access token here>)
//	@Security		BearerAuth
//	@Success		200	{arrary}	model.UserBloodPressure	"sucess"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/user_blood_pressures [post]
func ListBloodPressures(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	userId := c.GetString("UserId")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	userBloodPressureService := service.UserBloodPressureService
	ubps, err := userBloodPressureService.PagingQueryByUserId(c, userId, page, limit)
	if err != nil {
		resp.ToErrorResponse(errcode.ListUserBloodPressureError)
	} else {
		resp.ToResponse(ubps)
	}
}

// delete a user blood pressure record godoc
//
//	@Summary		delete a user blood pressure record
//	@Description	delete a user blood pressure record
//	@Tags			user_blood_pressure
//	@Accept			json
//	@Produce		json
//	@Param			id	path	string	true	"user blood pressure id"
//	@Security		BearerAuth
//	@Success		200	{arrary}	model.SuccessReponseSwagger	"sucess"
//	@Failure		400	{object}	errcode.Error				"bad request error"
//	@Failure		500	{object}	errcode.Error				"internal server error"
//	@Router			/api/v1/user_blood_pressure/{id} [post]
func DeleteBloodPressure(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	id := c.Params.ByName("id")
	err := service.UserBloodPressureService.Delete(c, id)
	if err != nil {
		resp.ToErrorResponseWithError(errcode.DeleteUserBloodPressureError, err)
	} else {
		resp.ToResponse(gin.H{"success": true})
	}
}

func DowonloadBloodPressure(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	id := c.Params.ByName("id")
	f, err := service.UserBloodPressureService.CreateExcelizeFile(c, id)
	if err != nil {
		resp.ToErrorResponseWithError(errcode.DeleteUserBloodPressureError, err)
		return
	}
	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Transfer-Encoding", "binary")
	now := time.Now()
	fileName := now.Format("20060102_150405.xlsx")
	c.Header("Content-Disposition", fmt.Sprintf("attachment;filename=\"%s-%s\"", id, fileName))
	f.Write(c.Writer)
}
