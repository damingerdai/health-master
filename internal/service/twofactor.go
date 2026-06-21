package service

import (
	"context"
	"errors"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/cryptox"
	"github.com/pquerna/otp/totp"
)

type TwoFactorService struct {
	Aes            *cryptox.AES
	UserRepository *repository.UserRepository
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

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "HealthMaster",
		AccountName: email,
	})
	if err != nil {
		return nil, err
	}

	secret := key.Secret()
	aseSecret, err := s.Aes.Encrypt(secret)
	if err != nil {
		return nil, err
	}
	err = s.UserRepository.SaveTwoFactorSecret(ctx, userID, aseSecret)
	if err != nil {
		return nil, err
	}

	return &model.Setup2FaResult{
		QRCode: key.URL(),
		Secret: secret,
	}, nil
}

func (s *TwoFactorService) Enable(ctx context.Context, userID string, code string) error {
	if s.Aes == nil {
		return errors.New("2fa is not configured")
	}

	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
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
		return errors.New("invalid code")
	}

	return s.UserRepository.EnableTwoFactor(ctx, userID)
}

func (s *TwoFactorService) Disable(ctx context.Context, userID string, code string) error {
	if s.Aes == nil {
		return errors.New("2fa is not configured")
	}

	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
	}
	if user.TwoFactorSecret == nil {
		return errors.New("2fa secret not found")
	}

	twoFactorSecret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return err
	}

	if !totp.Validate(code, twoFactorSecret) {
		return errors.New("invalid code")
	}

	return s.UserRepository.DisableTwoFactor(ctx, userID)
}

func (s *TwoFactorService) VerifyCode(ctx context.Context, userID string, code string) error {
	user, err := s.UserRepository.Find(ctx, userID)
	if err != nil {
		return err
	}

	if user == nil {
		return errors.New("user not found")
	}

	if user.TwoFactorSecret == nil {
		return errors.New("2fa not configured")
	}

	secret, err := s.Aes.Decrypt(*user.TwoFactorSecret)
	if err != nil {
		return err
	}

	if !totp.Validate(code, secret) {
		return errors.New("invalid verification code")
	}

	return nil
}
