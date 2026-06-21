package model

type Setup2FaResult struct {
	Secret string `json:"secret"`
	QRCode string `json:"qr_code"`
}
