package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/logger"
	"github.com/damingerdai/health-master/internal/routers"
	"github.com/damingerdai/health-master/pkg/server"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

func init() {
	var err = godotenv.Load()
	if err != nil {
		log.Println("fail to setup server: " + err.Error())
	}
	err = setupSetting()
	if err != nil {
		panic("fail to setup server: " + err.Error())
	}
	err = setupDBEngine()
	if err != nil {
		panic("fail to setup database: " + err.Error())
	}

	err = setupRedisClient()
	if err != nil {
		panic("init setup RedisClient err: " + err.Error())
	}
}

func main() {
	gin.SetMode(global.ServerSetting.RunMode)
	router := routers.NewRouter()
	s := &http.Server{
		Addr:         fmt.Sprintf(":%s", global.ServerSetting.HttpPort),
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log, err := logger.NewLogger("info")
	if err != nil {
		panic(err)
	}
	app, err := server.New(s, global.ServerSetting.RunMode)
	if err != nil {
		log.Error(fmt.Sprintf("run server: %s", err.Error()))
		os.Exit(-1)
	}
	log.Info("health master server is running")
	app.Run()
}

func setupSetting() error {
	settings, err := setting.NewSetting()
	if err != nil {
		return err
	}
	var appSetting setting.Settings
	err = settings.ReadAllSection(&appSetting)
	if err != nil {
		return nil
	}
	global.ServerSetting = &appSetting.Server
	global.DatabaseSetting = &appSetting.Database
	global.JwtSetting = &appSetting.JWT
	global.JwtSetting.Expire *= time.Second
	global.RedisSetting = &appSetting.Redis

	return nil
}

func setupDBEngine() error {
	var err error
	global.DBEngine, err = db.NewDBEngine(global.DatabaseSetting)
	if err != nil {
		return err
	}

	return nil
}

func setupRedisClient() error {
	ctx := context.Background()
	rdb := redis.NewClient(&redis.Options{
		Addr:     global.RedisSetting.Addr(),
		Password: global.RedisSetting.Password,
		DB:       int(global.RedisSetting.DB),
	})
	s := rdb.Ping(ctx)
	if s.Err() != nil {
		return s.Err()
	}
	global.RedisClient = rdb

	return nil
}
