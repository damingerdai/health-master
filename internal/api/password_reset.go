package api

import (
	"net/http"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// @Summary		create a password reset request
// @Description	send a password reset link to the user's email
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			RequestResetInput	body		model.RequestResetInput	true	"email address"
// @Success		202					{object}	map[string]interface{}					"password reset link sent"
// @Failure		400					{object}	map[string]interface{}					"bad request error"
// @Failure		500					{object}	map[string]interface{}					"internal server error"
// @Router			/api/v1/password-resets [post]
func CreateResetPassword(c *gin.Context) {
	var input model.RequestResetInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userRepository := repository.NewUserRepository(global.DBEngine)
	tokenRepository := repository.NewTokenRecordRepository(global.DBEngine)
	tokenService := service.NewTokenService(userRepository, tokenRepository)
	resetPasswordToken, err := tokenService.CreatePasswordResetToken(c, input.Email)
	if err != nil {
		global.Logger.Error("fail to create password reset token", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create password reset token"})
		return
	}
	// Here you would typically send the reset link via email to the user.
	// For this example, we'll just log the token.
	global.Logger.Info("Password reset link (token):", zap.String("token", resetPasswordToken))
	c.JSON(http.StatusAccepted, gin.H{
		"message": "If the email exists, a password reset link has been sent.",
	})
}

// @Summary		verify password reset token
// @Description	verify the validity of a password reset token
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			token	path		string	true	"password reset token"
// @Success		200		{object}	map[string]interface{}	"masked email"
// @Failure		400		{object}	map[string]interface{}	"invalid or expired token"
// @Failure		500		{object}	map[string]interface{}	"internal server error"
// @Router			/api/v1/password-resets/{token} [get]
func VerifyResetToken(c *gin.Context) {
	token := c.Param("token")
	srv := service.New(global.DBEngine, global.Logger)
	tokenService := srv.TokenService

	email, err := tokenService.VerifyPasswordResetToken(c, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email": email})
}

// @Summary		reset password
// @Description	reset user password with a valid password reset token
// @Tags			password-reset
// @Accept			json
// @Produce		json
// @Param			token						path		string							true	"password reset token"
// @Param			ResetPasswordSubmitInput	body		model.ResetPasswordSubmitInput	true	"new password and confirmation"
// @Success		200							{object}	map[string]interface{}			"password reset successfully"
// @Failure		400							{object}	map[string]interface{}			"bad request error"
// @Failure		500							{object}	map[string]interface{}			"internal server error"
// @Router			/api/v1/password-resets/{token} [put]
func ResetPassword(c *gin.Context) {
	var input model.ResetPasswordSubmitInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	if input.ConfirmPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Confirm password cannot be empty"})
		return
	}
	if input.Password != input.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}
	token := c.Param("token")
	srv := service.New(global.DBEngine, global.Logger)
	userService := srv.UserService

	_, err := userService.ResetPassword(c.Request.Context(), input.Email, token, input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
