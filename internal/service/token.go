package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/pwd"
	"github.com/damingerdai/health-master/pkg/util"
	"github.com/damingerdai/health-master/pkg/util/tokens"
	"go.uber.org/zap"
)

type tokenUserRepository interface {
	FindByEmail(context.Context, string) (*model.User, error)
	Find(context.Context, string) (*model.User, error)
}

type TokenService struct {
	userRepository   tokenUserRepository
	twoFactorService *TwoFactorService
	tokenRepo        *repository.TokenRecordRepository
	logger           *zap.Logger
}

func NewTokenService(userRepository *repository.UserRepository, tokenRepo *repository.TokenRecordRepository, logger *zap.Logger) *TokenService {
	return &TokenService{userRepository: userRepository, tokenRepo: tokenRepo, logger: logger}
}

func (ts *TokenService) CreateAccessToken(ctx context.Context, user *model.User) (*model.UserToken, error) {
	redisService := NewRedisService(global.RedisClient)

	userKey := fmt.Sprintf("token-user-%s", user.Id)
	result, err := redisService.Get(ctx, userKey)
	if err == nil {
		if token, ok := result.(model.UserToken); ok {
			return &token, nil
		}
	}

	now := time.Now()
	expire := now.Add(global.JwtSetting.Expire)

	token, err := tokens.CreateToken(
		global.JwtSetting.GetJwtSecret(),
		user.Id,
		global.JwtSetting.Issuer,
		expire,
	)
	if err != nil {
		return nil, err
	}

	userToken := model.UserToken{
		AccessToken: *token,
		Expired:     expire,
	}

	redisService.SaveNX(
		ctx,
		userKey,
		userToken,
		global.JwtSetting.Expire.Abs()-5*time.Second,
	)

	return &userToken, nil
}

func (ts *TokenService) CreateChallengeToken(ctx context.Context, user *model.User) (*model.UserToken, error) {
	expire := time.Now().Add(5 * time.Minute)

	token, err := tokens.CreateToken(
		[]byte(string(global.JwtSetting.GetJwtSecret())+":2fa-challenge"),
		user.Id,
		global.JwtSetting.Issuer,
		expire,
	)
	if err != nil {
		return nil, err
	}

	return &model.UserToken{
		AccessToken: *token,
		Expired:     expire,
	}, nil
}

// Challenge tokens use a separate signing domain and cannot authorize API requests.
func (ts *TokenService) ParseChallengeToken(token string) (*model.Claims, error) {
	return tokens.ParseToken(token, []byte(string(global.JwtSetting.GetJwtSecret())+":2fa-challenge"))
}

func (ts *TokenService) CreateToken(ctx context.Context, email string, password string, twoFactorCode string) (*model.UserToken, error) {
	logger := ts.logger
	if logger == nil {
		logger = zap.NewNop()
	}
	logger = logger.With(zap.String("operation", "create_token"))
	user, err := ts.userRepository.FindByEmail(ctx, email)
	if err != nil {
		logger.Error("failed to find user", zap.Error(err))
		return nil, err
	}
	if user == nil {
		logger.Warn("user not found")
		return nil, errors.New("user not found")
	}
	logger = logger.With(zap.String("user_id", user.Id))
	if err := pwd.Authenticate(password, user.Password); err != nil {
		logger.Warn("password verification failed", zap.Error(err))
		return nil, err
	}
	if user.TwoFactorEnabled {
		if twoFactorCode == "" {
			logger.Warn("two-factor code missing")
			return nil, errcode.ErrTwoFactorAuthenticationRequired
		}
		if ts.twoFactorService == nil {
			logger.Error("two-factor service unavailable")
			return nil, errcode.ServerError
		}
		if err := ts.twoFactorService.VerifyCode(ctx, user.Id, twoFactorCode); err != nil {
			if errors.Is(err, ErrInvalidTwoFactorCode) {
				logger.Warn("two-factor verification failed")
				return nil, errcode.InvalidVerificationCode
			}
			logger.Error("failed to verify two-factor code", zap.Error(err))
			return nil, fmt.Errorf("%w: verify two-factor code: %w", errcode.ServerError, err)
		}
	}
	token, err := ts.CreateAccessToken(ctx, user)
	if err != nil {
		logger.Error("failed to create access token", zap.Error(err))
		return nil, err
	}
	logger.Info("access token issued", zap.Bool("two_factor_enabled", user.TwoFactorEnabled))
	return token, nil
}

func (ts *TokenService) CreateTmpToken(ctx context.Context, user *model.User, expireTime time.Time) (*model.UserToken, error) {
	token, err := tokens.CreateToken(global.JwtSetting.GetJwtSecret(), user.Id, global.JwtSetting.Issuer, expireTime)
	if err != nil {
		return nil, err
	}
	userToken := model.UserToken{AccessToken: *token, Expired: expireTime}

	return &userToken, nil
}

func (ts *TokenService) ParseToken(token string) (*model.Claims, error) {
	secret := global.JwtSetting.GetJwtSecret()
	claims, err := tokens.ParseToken(token, secret)
	if err != nil {
		return nil, err
	}

	return claims, err
}

func (ts *TokenService) CreatePasswordResetToken(ctx context.Context, email string) (string, error) {
	user, err := ts.userRepository.FindByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("user not found")
	}

	rawToken, err := util.GenerateRandomString(32)
	if err != nil {
		return "", err
	}
	metadata := map[string]any{
		"email":  email,
		"source": "web_request",
	}
	err = ts.tokenRepo.CreatePasswordResetToken(ctx, user.Id, rawToken, metadata)
	if err != nil {
		return "", fmt.Errorf("failed to save token to db: %w", err)
	}
	return rawToken, nil
}

func (ts *TokenService) VerifyPasswordResetToken(ctx context.Context, rawToken string) (string, error) {
	tokenHash := ts.tokenRepo.HashToken(rawToken)
	userID, email, err := ts.tokenRepo.GetUserByValidToken(ctx, tokenHash, contants.TokenCategoryPasswordReset)
	if err != nil {
		global.Logger.Error("fail to get token", zap.String("rawToken", rawToken), zap.String("token_category", contants.TokenCategoryPasswordReset), zap.Error(err))
		return "", err
	}
	if userID == "" {
		global.Logger.Error("fail to get user info", zap.Error(err))
		return "", errors.New("invalid or expired token")
	}
	user, err := ts.userRepository.Find(ctx, userID)
	if err != nil {
		global.Logger.Error("fail to get user info by userID", zap.Error(err))
		return "", errors.New("invalid or expired token")
	}
	if user == nil {
		global.Logger.Error("user not found", zap.Error(err))
		return "", errors.New("invalid or expired token")
	}
	return email, nil
}
