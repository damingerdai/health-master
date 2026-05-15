package api

import (
	"fmt"
	"strings"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// @Summary		create a password reset request
// @Description	send a password reset link to the user's email
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			RequestResetInput	body		model.RequestResetInput	true	"email address"
// @Success		200					{object}	errcode.Error							"password reset link sent"
// @Failure		400					{object}	errcode.Error							"bad request error"
// @Failure		500					{object}	errcode.Error							"internal server error"
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
	tokenService := service.NewTokenService(userRepository, tokenRepository)
	resetPasswordToken, err := tokenService.CreatePasswordResetToken(c, input.Email)
	if err != nil {
		global.Logger.Error("fail to create password reset token", zap.Error(err))
		res.ToErrorResponse(errcode.FailedToCreatePasswordResetToken)
		return
	}
	// Here you would typically send the reset link via email to the user.
	// For this example, we'll just log the token.
	global.Logger.Info("Password reset link (token):", zap.String("token", resetPasswordToken))
	targetEmail := input.Email
	targetToken := resetPasswordToken
	go sendResetPasswordEmail(targetEmail, targetToken)
	res.ToResponse(errcode.PasswordResetEmailSent)
}

func sendResetPasswordEmail(email, token string) {
	defer func() {
		if r := recover(); r != nil {
			global.Logger.Error("Recovered from panic in sendResetPasswordEmail",
				zap.Any("panic", r),
				zap.String("email", email),
			)
		}
	}()
	frontendURL := strings.TrimRight(global.ServerSetting.FrontendURL, "/")
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, token)
	currentEnv := "staging"
	maxRetries := 3
	var err error
	for i := range maxRetries {
		err = global.Mailer.SendResetPassword(email, currentEnv, resetLink)
		if err == nil {
			global.Logger.Info("Send reset email success", zap.String("email", email))
			return
		}
		if i < maxRetries-1 {
			time.Sleep(time.Second * time.Duration(i+1))
		}
	}
	if err != nil {
		global.Logger.Error("Failed to send reset password email after retries", zap.String("email", email), zap.Error(err))
	} else {
		global.Logger.Info("send reset password email", zap.String("email", email), zap.String("token", token), zap.String("resetLink", resetLink))
	}
}

// @Summary		verify password reset token
// @Description	verify the validity of a password reset token
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			token	path		string	true	"password reset token"
// @Success		200		{object}	map[string]string	"masked email"
// @Failure		400		{object}	errcode.Error		"invalid or expired token"
// @Failure		500		{object}	errcode.Error		"internal server error"
// @Router			/api/v1/password-resets/{token} [get]
func VerifyResetToken(c *gin.Context) {
	token := c.Param("token")
	res := response.NewResponse(c)
	srv := service.New(global.DBEngine, global.Logger)
	tokenService := srv.TokenService

	email, err := tokenService.VerifyPasswordResetToken(c, token)
	if err != nil {
		res.ToErrorResponse(errcode.InvalidOrExpiredToken)
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
		res.ToErrorResponse(errcode.ConfirmPasswordCannotBeEmpty)
		return
	}
	if input.Password != input.ConfirmPassword {
		res.ToErrorResponse(errcode.PasswordsDoNotMatch)
		return
	}
	token := c.Param("token")
	srv := service.New(global.DBEngine, global.Logger)
	userService := srv.UserService

	_, err = userService.ResetPassword(c.Request.Context(), input.Email, token, input.Password)
	if err != nil {
		global.Logger.Error("Failed to reset password", zap.Error(err))
		res.ToErrorResponse(errcode.FailedToResetPassword)
		return
	}

	res.ToResponse(errcode.PasswordResetSuccessfully)
}
