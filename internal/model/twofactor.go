package model

type Setup2FaResult struct {
	Enabled bool   `json:"enabled"`
	Secret  string `json:"secret,omitempty"`
	QRCode  string `json:"qr_code,omitempty"`
}

type TwoFactorSetupResponse struct {
	Enabled    bool   `json:"enabled"`
	OTPAuthURL string `json:"otpauthUrl,omitempty"`
}

type UpdateTwoFactorRequest struct {
	Enabled bool   `json:"enabled"`
	Code    string `json:"code" binding:"required,len=6,numeric"`
}
