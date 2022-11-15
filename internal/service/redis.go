package service

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/pkg/serializer"
	"github.com/go-redis/redis/v8"
)

type RedisService struct {
	redisClient       *redis.Client
	defaultExpireTime time.Duration
}

func NewRedisService(redisClient *redis.Client) *RedisService {
	return &RedisService{redisClient: redisClient, defaultExpireTime: time.Hour}
}

func (rs *RedisService) Save(ctx context.Context, key string, value any) error {
	var sr serializer.RedisSerializer[any] = serializer.GobRedisSerializer[any]{}

	data, err := sr.Serialize(value)
	if err != nil {
		return err
	}
	rs.redisClient.SetNX(ctx, key, data, rs.defaultExpireTime)

	return err
}

func (rs *RedisService) SaveNX(ctx context.Context, key string, value any, expireTime time.Duration) error {
	var sr serializer.RedisSerializer[any] = serializer.GobRedisSerializer[any]{}

	data, err := sr.Serialize(value)
	if err != nil {
		return err
	}
	rs.redisClient.SetNX(ctx, key, data, expireTime.Abs())

	return err
}

func (rs *RedisService) Get(ctx context.Context, key string) (any, error) {
	var sr serializer.RedisSerializer[any] = serializer.GobRedisSerializer[any]{}
	val, err := rs.redisClient.Get(ctx, key).Result()
	if err != nil && err != redis.Nil {
		return nil, err
	}
	if len(val) == 0 {
		return nil, redis.Nil
	}
	data, err := sr.Deserialize([]byte(val))
	if err != nil {
		return nil, err
	}
	return data, nil
}
