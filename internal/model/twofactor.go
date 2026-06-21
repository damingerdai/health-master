package model

type Setup2FaResult struct {
	Secret string `json:"secret"`
	QRCode string `json:"qr_code"`
}

type TwoFactorSetupResponse struct {
	Enabled    bool   `json:"enabled"`
	OTPAuthURL string `json:"otpauthUrl,omitempty"`
}

type UpdateTwoFactorRequest struct {
	Enabled bool   `json:"enabled"`
	Code    string `json:"code" binding:"required,len=6,numeric"`
}
