package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetTwoFactor godoc
//
//	@Summary		Get Two-Factor Authentication setup
//	@Description	Get the current 2FA status. If 2FA is not enabled, an otpauth URL will be generated for enrollment.
//	@Tags			settings
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	model.Setup2FaResult	"success"
//	@Failure		401	{object}	errcode.Error			"unauthorized"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//
//	@Router			/api/v1/settings/2fa [get]
func GetTwoFactor(c *gin.Context) {
	res := response.NewResponse(c)
	userId := c.GetString("UserId")
	if userId == "" {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	srv := getServices()
	ctx := c.Request.Context()
	user, err := srv.UserService.Find(ctx, userId)
	if err != nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	if user == nil {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}
	data, err := srv.TwoFactorService.Generate(ctx, userId, user.Email)
	if err != nil {
		global.Logger.Error("fail to get 2fa", zap.Error(err))
		res.ToErrorResponse(errcode.ServerError)
		return
	}

	res.ToResponse(data)
}

// UpdateTwoFactor godoc
//
//	@Summary		Enable or disable Two-Factor Authentication
//	@Description	Enable or disable TOTP-based two-factor authentication for the current user. A valid verification code is required.
//	@Tags			settings
//	@Accept			json
//	@Produce		json
//	@Param			request	body	model.UpdateTwoFactorRequest	true	"Update Two-Factor Authentication"
//	@Security		BearerAuth
//	@Success		200	{object}	map[string]interface{}	"success"
//	@Failure		400	{object}	errcode.Error			"bad request"
//	@Failure		401	{object}	errcode.Error			"unauthorized"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//
//	@Router			/api/v1/settings/2fa [put]
func UpdateTwoFactor(c *gin.Context) {
	res := response.NewResponse(c)
	userId := c.GetString("UserId")
	if userId == "" {
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}

	var req model.UpdateTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	ctx := c.Request.Context()
	srv := getServices()
	if req.Enabled == true {
		err := srv.TwoFactorService.Enable(ctx, userId, req.Code)
		if err != nil {
			res.ToErrorResponse(errcode.ServerError)
			return
		}
		res.ToResponse(gin.H{"code": 200})
		return
	} else {
		err := srv.TwoFactorService.Disable(ctx, userId, req.Code)
		if err != nil {
			res.ToErrorResponse(errcode.ServerError)
			return
		}
		res.ToResponse(gin.H{"code": 200})
		return
	}

}
