package api

import (
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
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}
	srv := service.New(global.DBEngine)
	err := srv.WeightRecordService.Create(c, &weightRecord)
	if err != nil {
		global.Logger.Info("fail to create weight record", zap.String("UserId", weightRecord.UserId), zap.Float64("Weight", weightRecord.Weight), zap.Time("RecordDate", weightRecord.RecordDate), zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(weightRecord)
}

func ListWeightRecords(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine)
	userId := c.Query("userId")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
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
	service := service.New(global.DBEngine)
	id := c.Params.ByName("id")
	err := service.WeightRecordService.DeleteWeightRecord(c, id)
	if err != nil {
		global.Logger.Info("fail to delete weight record", zap.String("WeightRecordId", id), zap.Error(err))
		resp.ToErrorResponseWithError(errcode.DeleteDeleteWeightRecordError, err)
		return
	}
	resp.ToResponse(gin.H{"success": true})
}
