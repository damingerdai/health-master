package service

import (
	"bytes"
	"context"
	"encoding/gob"
	"errors"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/util"
	"github.com/damingerdai/health-master/pkg/util/tokens"
	"github.com/go-redis/redis/v8"
)

type TokenService struct {
	userRepository *repository.UserRepository
}

func NewTokenService(userRepository *repository.UserRepository) *TokenService {
	return &TokenService{userRepository}
}

func (ts *TokenService) CreateToken(username string, password string) (*model.UserToken, error) {
	ctx := context.Background()
	user, err := ts.userRepository.FindByUserName(username)
	if err != nil {
		return nil, err
	}
	if user == nil || user.Id == "" || user.Password != util.GetMd5Hash(password) {
		return nil, errors.New("username or password error")
	}
	val, err := global.RedisClient.Get(ctx, fmt.Sprintf("token-user-%s", user.Id)).Result()
	if err == redis.Nil {
		return ts.doCreateToken(ctx, user)
	}
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	if len(val) != 0 {
		valb := []byte(val)
		data := gob.NewDecoder(bytes.NewReader(valb))
		userToken := &model.UserToken{}
		err = data.Decode(userToken)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		return userToken, nil
	}
	return ts.doCreateToken(ctx, user)
}

func (ts *TokenService) doCreateToken(ctx context.Context, user *model.User) (*model.UserToken, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(global.JwtSetting.Expire)
	token, err := tokens.CreateToken(global.JwtSetting.GetJwtSecret(), user.Username, global.JwtSetting.Issuer, expireTime.Unix())
	if err != nil {
		return nil, err
	}
	userToken := model.UserToken{AccessToken: *token, Expired: expireTime}
	var buffer bytes.Buffer
	enc := gob.NewEncoder(&buffer)
	enc.Encode(userToken)
	global.RedisClient.SetNX(ctx, fmt.Sprintf("token-user-%s", user.Id), buffer.Bytes(), global.JwtSetting.Expire.Abs()-5*time.Second)
	return &userToken, nil
}

func (ts *TokenService) ParseToken(token string) (*model.Claims, error) {
	secret := global.JwtSetting.GetJwtSecret()
	claims, err := tokens.ParseToken(token, secret)

	return claims, err
}
