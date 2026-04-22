package api

import (
	"fmt"
	"strings"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// create a weight record godoc
//
//	@Summary		create a weight record
//	@Description	create a new weight record
//	@Tags			weight_record
//	@Accept			json
//	@Produce		json
//	@Param			weight_record	body	model.WeightRecord	true	"create a weight record"
//	@Security		BearerAuth
//	@Success		200	{object}	model.WeightRecord	"success"
//	@Failure		400	{object}	errcode.Error		"bad request error"
//	@Failure		500	{object}	errcode.Error		"internal server error"
//	@Router			/api/v1/weight-record [post]
func AddWeightRecord(c *gin.Context) {
	var weightRecord model.WeightRecord
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&weightRecord); err != nil {
		fmt.Print("fail to parse weight record: ", err)
		global.Logger.Info("fail to prase weight record", zap.String("UserId", weightRecord.UserId), zap.Float64("Weight", weightRecord.Weight), zap.Time("RecordDate", weightRecord.RecordDate), zap.Error(err))
		resp.ToErrorResponse(errcode.InvalidParams.WithDetails(err.Error()))
		return
	}
	srv := service.New(global.DBEngine, global.Logger)
	err := srv.WeightRecordService.Create(c, &weightRecord)
	if err != nil {
		fmt.Print("fail to create weight record: ", err)
		global.Logger.Info("fail to create weight record", zap.String("UserId", weightRecord.UserId), zap.Float64("Weight", weightRecord.Weight), zap.Time("RecordDate", weightRecord.RecordDate), zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(weightRecord)
}

// list weight records godoc
//
//	@Summary		list weight records
//	@Description	list weight records with pagination
//	@Tags			weight_record
//	@Accept			json
//	@Produce		json
//	@Param			userId			query	string	false	"user id"
//	@Param			accessToken		query	string	false	"access token"
//	@Param			Authorization	header	string	false	"Authorization token"
//	@Param			page			query	string	false	"page"
//	@Param			limit			query	string	false	"limit"
//	@Security		BearerAuth
//	@Success		200	{object}	model.ListResponse[model.WeightRecordVO]	"success"
//	@Failure		400	{object}	errcode.Error								"bad request error"
//	@Failure		500	{object}	errcode.Error								"internal server error"
//	@Router			/api/v1/weight-records [get]
func ListWeightRecords(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	var userId = c.Query("userId")
	if len(userId) == 0 {
		var (
			err   error
			token string
		)
		if s, exist := c.GetQuery("accessToken"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
			token = strings.TrimPrefix(token, "Bearer ")
		}
		global.Logger.Debug("list a single user weight records", zap.String("Authorization", token))
		if len(token) == 0 {
			global.Logger.Error("fail to list a single user weight records", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		userId, err = service.UserService.GetUserIdByAuthorization(c, token)
		if err != nil {
			global.Logger.Error("fail to list a single user weight records", zap.Error(err))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		if len(userId) == 0 {
			global.Logger.Error("fail to list a single user weight records", zap.Error(errcode.UnauthorizedAuthNotExist))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		global.Logger.Info("list a single user weight records", zap.String("UserId", userId))
	}
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	global.Logger.Debug("list a single user weight records", zap.String("UserId", userId), zap.String("Page", page), zap.String("Limit", limit))
	weightRecordService := service.WeightRecordService
	res, err := weightRecordService.PagingQueryByUserId(c, userId, limit, page)
	if err != nil {
		global.Logger.Error("fail to list a single user weight records", zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(res)
}

// delete a weight record godoc
//
//	@Summary		delete a weight record
//	@Description	delete a weight record by id
//	@Tags			weight_record
//	@Accept			json
//	@Produce		json
//	@Param			id	path	string	true	"weight record id"
//	@Security		BearerAuth
//	@Success		200	{object}	map[string]interface{}	"success"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/weight-record/{id} [delete]
func DeleteWeightRecord(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	id := c.Params.ByName("id")
	err := service.WeightRecordService.DeleteWeightRecord(c, id)
	if err != nil {
		global.Logger.Info("fail to delete weight record", zap.String("WeightRecordId", id), zap.Error(err))
		resp.ToErrorResponseWithError(errcode.DeleteDeleteWeightRecordError, err)
		return
	}
	resp.ToResponse(gin.H{"success": true})
}
