package cryptox

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
)

type AES struct {
	key []byte
}

func NewAES(key string) (*AES, error) {
	if len(key) != 32 {
		return nil, errors.New("ASE key must be exactly 32 bytes")
	}

	return &AES{
		key: []byte(key),
	}, nil
}

func (a *AES) Encrypt(plaintext string) (string, error) {
	block, err := aes.NewCipher(a.key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())

	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	chipertext := gcm.Seal(nil, nonce, []byte(plaintext), nil)

	result := append(nonce, chipertext...)

	return base64.StdEncoding.EncodeToString(result), nil
}

func (a *AES) Decrypt(chiper string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(chiper)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(a.key)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()

	if len(data) < nonceSize {
		return "", errors.New("invalid chipertext")
	}

	nonce := data[:nonceSize]
	chipertext := data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, chipertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
