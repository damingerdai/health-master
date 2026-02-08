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
	"github.com/damingerdai/health-master/pkg/util"
	"github.com/damingerdai/health-master/pkg/util/tokens"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type TokenService struct {
	userRepository *repository.UserRepository
	tokenRepo      *repository.TokenRecordRepository
}

func NewTokenService(userRepository *repository.UserRepository, tokenRepo *repository.TokenRecordRepository) *TokenService {
	return &TokenService{userRepository, tokenRepo}
}

func (ts *TokenService) CreateToken(ctx context.Context, username string, password string) (*model.UserToken, error) {
	redisService := NewRedisService(global.RedisClient)
	user, err := ts.userRepository.FindByUserName(ctx, username)
	if err != nil {
		return nil, err
	}
	global.Logger.Info("founded user", zap.String("username", username), zap.String("userId", user.Id), zap.String("hashedPassword", user.Password))
	if user == nil || user.Id == "" || user.Password != util.GetMd5Hash(password) {
		global.Logger.Error("username or password error", zap.String("username", username), zap.String("password", password), zap.String("hashedPassword", util.GetMd5Hash(password)))
		return nil, errors.New("username or password error")
	}
	var userKey = fmt.Sprintf("token-user-%s", user.Id)
	result, err := redisService.Get(ctx, userKey)
	if err == redis.Nil {
		return ts.doCreateToken(ctx, user)
	}
	if err != nil {
		return nil, err
	}
	if r, ok := result.(model.UserToken); ok {
		return &r, nil
	}

	return ts.doCreateToken(ctx, user)
}

func (ts *TokenService) doCreateToken(ctx context.Context, user *model.User) (*model.UserToken, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(global.JwtSetting.Expire)
	redisService := NewRedisService(global.RedisClient)
	token, err := tokens.CreateToken(global.JwtSetting.GetJwtSecret(), user.Id, global.JwtSetting.Issuer, expireTime)
	if err != nil {
		return nil, err
	}
	userKey := fmt.Sprintf("token-user-%s", user.Id)
	userToken := model.UserToken{AccessToken: *token, Expired: expireTime}
	redisService.SaveNX(ctx, userKey, userToken, global.JwtSetting.Expire.Abs()-5*time.Second)

	return &userToken, nil
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
	userID, email, err := ts.tokenRepo.GetUserByValidToken(ctx, rawToken, contants.TokenCategoryPasswordReset)
	if err != nil {
		return "", err
	}
	if userID == "" {
		return "", errors.New("invalid or expired token")
	}
	user, err := ts.userRepository.FindByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("user not found")
	}
	if user.Id != userID {
		return "", errors.New("token does not match user")
	}
	return user.Id, nil
}
