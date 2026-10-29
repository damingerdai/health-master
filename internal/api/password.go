package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func ChangePassword(c *gin.Context) {
	var err error
	res := response.NewResponse(c)
	logger := global.Logger
	if logger == nil {
		logger = zap.NewNop()
	}
	logger = logger.With(zap.String("operation", "change_password"))
	userId := c.GetString("UserId")
	if userId == "" {
		logger.Warn("password change requested without user identity")
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	logger = logger.With(zap.String("user_id", userId))
	var input model.ChangePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Warn("invalid password change request")
		res.ToErrorResponseWithDetails(errcode.InvalidParams, err)
		return
	}
	if input.CurrentPassword == "" {
		logger.Warn("current password missing")
		res.ToErrorResponse(errcode.InvalidParams.WithDetails("Confirm password cannot be empty"))
		return
	}
	ctx := c.Request.Context()
	srv := getServices()
	userService := srv.UserService
	err = userService.ChangePassword(ctx, userId, &input)
	if err != nil {
		_ = c.Error(err)
		if codeErr, ok := err.(*errcode.Error); ok {
			res.ToErrorResponse(codeErr)
		} else {
			res.ToErrorResponse(errcode.ServerError)
		}
		return
	}
	res.ToResponse(errcode.Success)
}
