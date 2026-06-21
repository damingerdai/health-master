package model

type LoginResponse struct {
	NeedTwoFactor bool `json:"needTwoFactor"`

	ChallengeToken *string `json:"challengeToken,omitempty"`

	Token *UserToken `json:"token,omitempty"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type VerifyLoginRequest struct {
	ChallengeToken string `json:"challengeToken" binding:"required"`
	Code           string `json:"code" binding:"required,len=6"`
}
