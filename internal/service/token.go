package service

import (
	"errors"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/util"
	"github.com/golang-jwt/jwt/v4"
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
	claims := model.Claims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    global.JwtSetting.Issuer,
		},
	}
	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString(global.JwtSetting.GetJwtSecret())
	if err != nil {
		return nil, err
	}
	return &model.UserToken{AccessToken: token, Expired: expireTime}, nil
}

func (ts *TokenService) ParseToken(token string) (*model.Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &model.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return global.JwtSetting.GetJwtSecret(), nil
	})

	if err != nil {
		return nil, err
	}
	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*model.Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}

	return nil, err
}
