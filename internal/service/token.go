package service

import (
	"errors"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/util"
	"github.com/damingerdai/health-master/pkg/util/tokens"
)

type TokenService struct {
	userRepository *repository.UserRepository
}

func NewTokenService(userRepository *repository.UserRepository) *TokenService {
	return &TokenService{userRepository}
}

func (ts *TokenService) CreateToken(username string, password string) (*model.UserToken, error) {
	user, err := ts.userRepository.FindByUserName(username)
	if err != nil {
		return nil, err
	}
	if user == nil || user.Id == "" || user.Password != util.GetMd5Hash(password) {
		return nil, errors.New("username or password error")
	}

	return ts.doCreateToken(user)
}

func (ts *TokenService) doCreateToken(user *model.User) (*model.UserToken, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(global.JwtSetting.Expire)
	token, err := tokens.CreateToken(global.JwtSetting.GetJwtSecret(), user.Username, global.JwtSetting.Issuer, expireTime.Unix())
	if err != nil {
		return nil, err
	}
	return &model.UserToken{AccessToken: *token, Expired: expireTime}, nil
}

func (ts *TokenService) ParseToken(token string) (*model.Claims, error) {
	secret := global.JwtSetting.GetJwtSecret()
	claims, err := tokens.ParseToken(token, secret)

	return claims, err
}
