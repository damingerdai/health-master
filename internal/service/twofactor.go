package service

import (
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"image/png"
	"net/url"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/cryptox"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
)

var ErrInvalidTwoFactorCode = errors.New("invalid verification code")

type twoFactorRepository interface {
	Find(context.Context, string) (*model.User, error)
	SaveTwoFactorSecret(context.Context, string, string) error
	EnableTwoFactor(context.Context, string, string) error
	DisableTwoFactor(context.Context, string, string) error
}

type TwoFactorService struct {
	Aes            *cryptox.AES
	UserRepository twoFactorRepository
}

func NewTwoFactorService(aes *cryptox.AES, userRepostiory *repository.UserRepository) *TwoFactorService {
	return &TwoFactorService{
		Aes:            aes,
		UserRepository: userRepostiory,
	}
}

func (s *TwoFactorService) Generate(ctx context.Context, userID string, email string) (*model.Setup2FaResult, error) {
	if s.Aes == nil {
		return nil, errors.New("2fa is not configured")
	}

	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}
	if user.TwoFactorEnabled {
		return &model.Setup2FaResult{Enabled: true}, nil
	}
	if user.TwoFactorSecret == nil {
		key, err := totp.Generate(totp.GenerateOpts{Issuer: "HealthMaster", AccountName: email})
		if err != nil {
			return nil, err
		}
		encrypted, err := s.Aes.Encrypt(key.Secret())
		if err != nil {
			return nil, err
		}
		if err := s.UserRepository.SaveTwoFactorSecret(ctx, userID, encrypted); err != nil {
			return nil, err
		}
		// Re-read the winning secret if enrollment was started in multiple tabs.
		user, err = s.UserRepository.Find(ctx, userID)
		if err != nil {
			return nil, err
		}
		if user == nil {
			return nil, errors.New("user not found")
		}
		if user.TwoFactorEnabled {
			return &model.Setup2FaResult{Enabled: true}, nil
		}
	}
	if user.TwoFactorSecret == nil {
		return nil, errors.New("2fa secret not found")
	}
	secret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return nil, err
	}
	uri := url.URL{Scheme: "otpauth", Host: "totp", Path: "/HealthMaster:" + email}
	query := url.Values{"secret": {secret}, "issuer": {"HealthMaster"}, "algorithm": {"SHA1"}, "digits": {"6"}, "period": {"30"}}
	uri.RawQuery = query.Encode()
	key, err := otp.NewKeyFromURL(uri.String())
	if err != nil {
		return nil, err
	}
	img, err := key.Image(256, 256)
	if err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}
	return &model.Setup2FaResult{Secret: secret, QRCode: key.URL(), QRCodeImage: "data:image/png;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())}, nil
}

func (s *TwoFactorService) Enable(ctx context.Context, userID string, code string) error {
	if s.Aes == nil {
		return errors.New("2fa is not configured")
	}

	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}
	if user.TwoFactorSecret == nil {
		return errors.New("2fa secret not found")
	}

	twoFactorSecret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return err
	}

	ok := totp.Validate(code, twoFactorSecret)
	if !ok {
		return ErrInvalidTwoFactorCode
	}

	return s.UserRepository.EnableTwoFactor(ctx, userID, *user.TwoFactorSecret)
}

func (s *TwoFactorService) Disable(ctx context.Context, userID string, code string) error {
	if s.Aes == nil {
		return errors.New("2fa is not configured")
	}

	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}
	if user.TwoFactorSecret == nil {
		return errors.New("2fa secret not found")
	}

	twoFactorSecret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return err
	}

	if !totp.Validate(code, twoFactorSecret) {
		return ErrInvalidTwoFactorCode
	}

	return s.UserRepository.DisableTwoFactor(ctx, userID, *user.TwoFactorSecret)
}

func (s *TwoFactorService) VerifyCode(ctx context.Context, userID string, code string) error {
	if s.Aes == nil {
		return errors.New("2fa is not configured")
	}
	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	if !user.TwoFactorEnabled || user.TwoFactorSecret == nil {
		return errors.New("2fa not configured")
	}

	secret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return err
	}

	if !totp.Validate(code, secret) {
		return ErrInvalidTwoFactorCode
	}

	return nil
}
