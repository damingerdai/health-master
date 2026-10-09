package service

import (
	"context"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/pwd"
)

type AuthService struct {
	UserRepository   *repository.UserRepository
	TokenService     *TokenService
	TwoFactorService *TwoFactorService
}

func NewAuthService(
	userRepo *repository.UserRepository,
	tokenSvc *TokenService,
	twofaSvc *TwoFactorService,
) *AuthService {
	return &AuthService{
		UserRepository:   userRepo,
		TokenService:     tokenSvc,
		TwoFactorService: twofaSvc,
	}
}

func (s *AuthService) Login(ctx context.Context, email string, password string) (*model.LoginResponse, error) {
	user, err := s.UserRepository.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, errcode.UnauthorizedAuthNotExist
	}
	err = pwd.Authenticate(password, user.Password)
	if err != nil {
		return nil, err
	}

	if !user.TwoFactorEnabled {

		token, err := s.TokenService.CreateAccessToken(ctx, user)
		if err != nil {
			return nil, err
		}

		return &model.LoginResponse{
			NeedTwoFactor: false,
			Token:         token,
		}, nil
	}

	challenge, err := s.TokenService.CreateChallengeToken(ctx, user)
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		NeedTwoFactor:  true,
		ChallengeToken: &challenge.AccessToken,
	}, nil
}

func (s *AuthService) VerifyLogin(ctx context.Context, challengeToken string, code string) (*model.UserToken, error) {
	claims, err := s.TokenService.ParseChallengeToken(challengeToken)
	if err != nil {
		return nil, err
	}

	user, err := s.UserRepository.Find(ctx, claims.UserId)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errcode.UnauthorizedAuthNotExist
	}
	if err := s.TwoFactorService.VerifyCode(ctx, user.Id, code); err != nil {
		return nil, err
	}

	return s.TokenService.CreateAccessToken(ctx, user)
}
