package api

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/internal/task"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"go.uber.org/zap"
)

// @Summary		create a password reset request
// @Description	send a password reset link to the user's email
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			RequestResetInput	body		model.RequestResetInput	true	"email address"
// @Success		200					{object}	errcode.Error			"password reset link sent"
// @Failure		400					{object}	errcode.Error			"bad request error"
// @Failure		500					{object}	errcode.Error			"internal server error"
// @Router			/api/v1/password-resets [post]
func CreateResetPassword(c *gin.Context) {
	var err error
	var input model.RequestResetInput
	res := response.NewResponse(c)
	if err := c.ShouldBindJSON(&input); err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}

	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenRepository := repository.NewTokenRecordRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository, tokenRepository, global.Logger)
	resetPasswordToken, err := tokenService.CreatePasswordResetToken(c, input.Email)
	if err != nil {
		global.Logger.Error("fail to create password reset token", zap.Error(err))
		res.ToErrorResponse(errcode.ServerError)
		return
	}

	global.Logger.Info("reset password token is ready", zap.String("resetPasswordToken", resetPasswordToken))
	if resetPasswordToken != "" {
		go sendResetPasswordEmail(input.Email, resetPasswordToken)
	}
	res.ToResponse(gin.H{"message": "If the email exists, a password reset link has been sent."})
}

func sendResetPasswordEmail(email, token string) {
	defer func() {
		if r := recover(); r != nil {
			global.Logger.Error("Recovered from panic in sendResetPasswordEmail",
				zap.String("email", email),
				zap.Any("panic", r),
				zap.Stack("stack"),
			)
		}
	}()
	if global.AsynqClient == nil {
		global.Logger.Error("asynq client is not initialized, skip enqueue",
			zap.String("email", email))
		return
	}
	frontendURL := strings.TrimRight(global.ServerSetting.FrontendURL, "/")
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, token)
	currentEnv := "staging"
	maxRetries := 3
	payload := task.SendResetTokenPasswordPayload{
		ToEmail: email,
		Env:     currentEnv,
		Link:    resetLink,
	}
	var err error
	t, err := task.NewSendResetTokenPasswordMailTask(payload)
	if err != nil {
		global.Logger.Error("fail to send reset token password ", zap.String("email", email), zap.Error(err))
		return
	}
	info, err := global.AsynqClient.EnqueueContext(
		context.Background(),
		t,
		asynq.Queue("mail"),
		asynq.MaxRetry(maxRetries),
		asynq.Timeout(30*time.Second),
	)
	if err != nil {
		global.Logger.Error("Failed to send reset password email after retries", zap.String("email", email), zap.Error(err))
		return
	}
	global.Logger.Info("send reset password email", zap.String("email", email), zap.String("token", token), zap.String("resetLink", resetLink), zap.String("taskId", info.ID))
}

// @Summary		verify password reset token
// @Description	verify the validity of a password reset token
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			token	path		string				true	"password reset token"
// @Success		200		{object}	map[string]string	"masked email"
// @Failure		400		{object}	errcode.Error		"invalid or expired token"
// @Failure		500		{object}	errcode.Error		"internal server error"
// @Router			/api/v1/password-resets/{token} [get]
func VerifyResetToken(c *gin.Context) {
	token := c.Param("token")
	res := response.NewResponse(c)
	srv := getServices()
	tokenService := srv.TokenService

	email, err := tokenService.VerifyPasswordResetToken(c, token)
	if err != nil {
		res.ToErrorResponse(errcode.InvalidParams.WithDetails("Invalid or expired password reset token"))
		return
	}
	res.ToResponse(gin.H{"email": email})
}

// @Summary		reset password
// @Description	reset user password with a valid password reset token
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			token						path		string							true	"password reset token"
// @Param			ResetPasswordSubmitInput	body		model.ResetPasswordSubmitInput	true	"new password and confirmation"
// @Success		200							{object}	errcode.Error					"password reset successfully"
// @Failure		400							{object}	errcode.Error					"bad request error"
// @Failure		500							{object}	errcode.Error					"internal server error"
// @Router			/api/v1/password-resets/{token} [put]
func ResetPassword(c *gin.Context) {
	var err error
	var input model.ResetPasswordSubmitInput
	res := response.NewResponse(c)
	if err := c.ShouldBindJSON(&input); err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	if input.ConfirmPassword == "" {
		res.ToErrorResponse(errcode.InvalidParams.WithDetails("Confirm password cannot be empty"))
		return
	}
	if input.Password != input.ConfirmPassword {
		res.ToErrorResponse(errcode.InvalidParams.WithDetails("Passwords do not match"))
		return
	}
	token := c.Param("token")
	srv := getServices()
	userService := srv.UserService

	_, err = userService.ResetPassword(c.Request.Context(), input.Email, token, input.Password)
	if err != nil {
		global.Logger.Error("Failed to reset password", zap.Error(err))
		res.ToErrorResponse(errcode.ServerError)
		return
	}

	res.ToResponse(nil)
}
