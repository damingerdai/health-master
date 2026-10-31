package api

import (
	"errors"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
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
//	@Success		200	{object}	model.APIResponseSwagger[model.UserBloodPressure]	"success"
//	@Failure		400	{object}	model.ErrorResponseSwagger			"bad request error"
//	@Failure		401	{object}	model.ErrorResponseSwagger	"invalid or expired access token"
//	@Failure		500	{object}	model.ErrorResponseSwagger			"internal server error"
//	@Router			/api/v1/user-blood-pressure [post]
func CreateUserBloodPressure(c *gin.Context) {
	var userBloodPressure model.UserBloodPressure
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userBloodPressure); err != nil {
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		srvs := getTxServices(conn)
		user, err := srvs.UserService.Find(c, userBloodPressure.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = srvs.UserBloodPressureService.Create(c, &userBloodPressure)
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
//	@Description	List blood pressure records for the authenticated user. Invalid pagination values currently return HTTP 500.
//	@Tags			user_blood_pressure
//	@Produce		json
//	@Param			page			query	int	false	"Page number"	default(1)
//	@Param			limit			query	int	false	"Records per page"	default(5)
//	@Security		BearerAuth
//	@Success		200	{object}	model.APIResponseSwagger[model.ListResponse[model.UserBloodPressure]]	"success"
//	@Failure		401	{object}	model.ErrorResponseSwagger	"invalid or expired access token"
//	@Failure		500	{object}	model.ErrorResponseSwagger								"internal server error"
//	@Router			/api/v1/user-blood-pressures [get]
func ListBloodPressures(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	userId := c.GetString("UserId")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	userBloodPressureService := srvs.UserBloodPressureService
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
//	@Produce		json
//	@Param			id	path	string	true	"user blood pressure id"
//	@Security		BearerAuth
//	@Success		200	{object}	model.APIResponseSwagger[model.BloodPressureDeleteResultSwagger]	"success"
//	@Failure		401	{object}	model.ErrorResponseSwagger	"invalid or expired access token"
//	@Failure		500	{object}	model.ErrorResponseSwagger				"internal server error"
//	@Router			/api/v1/user-blood-pressure/{id} [delete]
func DeleteBloodPressure(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	id := c.Params.ByName("id")
	err := srvs.UserBloodPressureService.Delete(c, id)
	if err != nil {
		resp.ToErrorResponseWithError(errcode.DeleteUserBloodPressureError, err)
	} else {
		resp.ToResponse(gin.H{"success": true})
	}
}

// download user blood pressure excel godoc
//
//	@Summary		download user blood pressure excel
//	@Description	download user blood pressure excel
//	@Tags			user_blood_pressure
//	@Produce		application/octet-stream,json
//	@Param			id	path	string	true	"User ID whose blood pressure records will be exported"
//	@Security		BearerAuth
//	@Success		200	{file}		binary			"excel file"
//	@Failure		401	{object}	model.ErrorResponseSwagger	"invalid or expired access token"
//	@Failure		500	{object}	model.ErrorResponseSwagger	"internal server error"
//	@Router			/api/v1/user-blood-pressure/{id}/export [get]
func DowonloadBloodPressure(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	id := c.Params.ByName("id")
	f, err := srvs.UserBloodPressureService.CreateExcelizeFile(c, id)
	if err != nil {
		resp.ToErrorResponseWithError(errcode.ExportUserBloodPressureError, err)
		return
	}
	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Transfer-Encoding", "binary")
	now := time.Now()
	fileName := now.Format("20060102_150405.xlsx")
	c.Header("Content-Disposition", fmt.Sprintf("attachment;filename=\"%s-%s\"", id, fileName))
	f.Write(c.Writer)
}
