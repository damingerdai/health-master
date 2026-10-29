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
	CurrentPassword string  `json:"current_password" binding:"required,min=8"`
	NewPassword     string  `json:"new_password" binding:"required,min=8"`
	TwoFactorCode   *string `json:"two_factor_code" binding:"omitempty,len=6"`
}
