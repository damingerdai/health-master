package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/logger"
	"github.com/damingerdai/health-master/internal/routers"
	"github.com/damingerdai/health-master/pkg/server"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"

	_ "github.com/damingerdai/health-master/docs"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("fail to setup server: " + err.Error())
	}
	err = setupSetting()
	if err != nil {
		panic("fail to setup server: " + err.Error())
	}
	log.Println("setup app setting")
	err = setupDBEngine()
	if err != nil {
		panic("fail to setup database: " + err.Error())
	}
	log.Println("setup database")
	err = setupRedisClient()
	if err != nil {
		panic("init setup RedisClient err: " + err.Error())
	}
	log.Println("setup redis")
	err = setupLogger()
	if err != nil {
		panic("init setup logger err: " + err.Error())
	}
	global.Logger.Info("setyup logger")
	log.Println("setup logger")
}

// @title						health master api
// @version					1.0
// @description				health master open api
// @termsOfService				http://swagger.io/terms/
// @securityDefinitions.apiKey	BearerAuth
// @in							header
// @name						Authorization
// @description				Type "Bearer" followed by a space and JWT token.
func main() {
	router := routers.NewRouter()
	s := &http.Server{
		Addr:         fmt.Sprintf(":%s", global.ServerSetting.HttpPort),
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	global.Logger.Info("hello world")
	defer global.Logger.Sync()
	app, err := server.New(s, "release")
	if err != nil {
		global.Logger.Error(fmt.Sprintf("run server: %s", err.Error()))
		os.Exit(-1)
	}
	global.Logger.Info("health master server is running")
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
		// cannot parse 'Redis.Port' as int: strconv.ParseInt: parsing "tcp://****:6379": invalid syntax
		// this is unknodwn bug only in docker?
		if !strings.Contains(err.Error(), "cannot parse 'Redis.Port' as int") {
			return err
		}
		var redisSetting setting.RedisSettingS
		err = settings.ReadSection("Redis", &redisSetting)
		if err != nil {
			return err
		}
		appSetting.Redis = redisSetting
	}
	global.ServerSetting = &appSetting.Server
	global.DatabaseSetting = &appSetting.Database
	global.JwtSetting = &appSetting.JWT
	global.RedisSetting = &appSetting.Redis
	global.LoggerSetting = &appSetting.Logger

	return nil
}

func setupDBEngine() error {
	var err error

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*30)
	defer cancel()

	global.DBEngine, err = db.NewDBPool(ctx, global.DatabaseSetting.DBConnString())
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

func setupLogger() error {
	log, err := logger.NewLogger(global.LoggerSetting.Level)
	// log, err := zap.NewProduction()
	if err != nil {
		return err
	}
	global.Logger = log
	global.Logger.Info("hello world")

	return nil
}
