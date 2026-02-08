package util

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func GenerateRandomString(n int) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("failed to generate random token: %w", err)
	}

	rawToken := base64.URLEncoding.EncodeToString(b)
	return rawToken, nil
}
