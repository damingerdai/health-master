package api

import (
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/damingerdai/health-master/global"
)

// @Summary		User login
// @Description	Login with email and password. If 2FA is enabled, a challenge token will be returned.
// @Tags			auth
// @Accept			json
// @Produce		json
// @Param			login	body		model.LoginInput	true	"login request"
// @Success		200		{object}	model.LoginResponse
// @Failure		400		{object}	errcode.Error
// @Failure		401		{object}	errcode.Error
// @Failure		500		{object}	errcode.Error
// @Router			/api/v1/auth/login [post]
func Login(c *gin.Context) {

	var input model.LoginInput
	res := response.NewResponse(c)

	if err := c.ShouldBindJSON(&input); err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}

	srv := getServices()

	loginResp, err := srv.AuthService.Login(
		c.Request.Context(),
		input.Email,
		input.Password,
	)

	if err != nil {
		global.Logger.Error("login failed", zap.Error(err))
		res.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
		return
	}

	res.ToResponse(loginResp)
}

// VerifyLogin godoc
//
//	@Summary		Verify Two-Factor Authentication
//	@Description	Complete login using a challenge token and TOTP verification code.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		model.VerifyLoginRequest	true	"Verify Login Request"
//
//	@Success		200		{object}	model.UserToken				"success"
//	@Failure		400		{object}	errcode.Error				"bad request error"
//	@Failure		500		{object}	errcode.Error				"internal server error"
//
//	@Router			/api/v1/auth/login/2fa [post]
func VerifyLogin(c *gin.Context) {
	var req model.VerifyLoginRequest
	res := response.NewResponse(c)
	if err := c.ShouldBindJSON(&req); err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	srv := getServices()
	token, err := srv.AuthService.VerifyLogin(
		c.Request.Context(),
		req.ChallengeToken,
		req.Code,
	)
	if err != nil {
		global.Logger.Error("verify login failed", zap.Error(err))
		res.ToErrorResponse(errcode.InvalidVerificationCode)
		return
	}

	res.ToResponse(token)
}
