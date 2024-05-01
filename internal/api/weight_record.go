package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
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
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(weightRecord)
}
