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

func CreateUserHeight(c *gin.Context) {
	var err error
	var userHeight model.UserHeight
	res := response.NewResponse(c)
	err = c.ShouldBindJSON(&userHeight)
	if err != nil {
		global.Logger.Error("fail bing json request", zap.Error(err))
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	srvs := service.New(global.DBEngine, global.Logger)
	userHeightService := srvs.UserHeightService
	userHeigthVo, err := userHeightService.Create(c, &userHeight)
	if err != nil {
		global.Logger.Error("fail to create user height", zap.String("userId", userHeight.UserId), zap.Float64("height", userHeight.Height), zap.Time("recordDate", userHeight.RecordDate), zap.Error(err))
		res.ToErrorResponse(errcode.ServerError)
		return
	}
	res.ToResponse(userHeigthVo)
}
