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

// create a user height record godoc
//
//	@Summary		create a user height record
//	@Description	create a new record for user height
//	@Tags			user_height
//	@Accept			json
//	@Produce		json
//	@Param			user_height	body	model.UserHeight	true	"create a user height record"
//	@Security		BearerAuth
//	@Success		200	{object}	model.UserHeightVO	"success"
//	@Failure		400	{object}	errcode.Error		"bad request error"
//	@Failure		500	{object}	errcode.Error		"internal server error"
//	@Router			/api/v1/height [post]
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
