package model

type RequestResetInput struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordSubmitInput struct {
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}

type ChangePasswordInput struct {
	// Current password, at least 8 characters.
	CurrentPassword string `json:"current_password" binding:"required,min=8"`
	// New password, at least 8 characters.
	NewPassword string `json:"new_password" binding:"required,min=8"`
	// Six-digit TOTP code; required when 2FA is enabled.
	TwoFactorCode *string `json:"two_factor_code" binding:"omitempty,len=6"`
}
