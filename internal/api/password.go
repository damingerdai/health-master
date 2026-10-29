package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// ChangePassword godoc
//
// @Summary Change password
// @Description Change the authenticated user's password using the current password. A six-digit TOTP code is required when 2FA is enabled.
// @Description Limited to 5 requests per user per minute. Five password or TOTP verification failures within 15 minutes trigger a 15-minute lockout. Successful changes reset the failure count.
// @Tags settings
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body model.ChangePasswordInput true "Password change request"
// @Success 200 {object} map[string]interface{} "Password changed"
// @Failure 400 {object} errcode.Error "Invalid request or TOTP code"
// @Failure 401 {object} errcode.Error "Authentication required, invalid current password, or missing required TOTP code"
// @Failure 429 {object} errcode.Error "Request limit exceeded or temporarily locked out"
// @Header 429 {string} Retry-After "Seconds until another attempt is allowed"
// @Failure 500 {object} errcode.Error "Internal server error"
// @Router /api/v1/settings/password [put]
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
