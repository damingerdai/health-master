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
