package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/logger"
	"github.com/damingerdai/health-master/internal/routers"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func init() {
	var err = setupSetting()
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
	log := logger.NewLogger(logger.LevelInfo)
	log.Info("health master server is running")
	go func() {
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := s.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown", err)
	}
	select {
	case <-ctx.Done():
		log.Println("timeout of 5 seconds")
	}
	log.Println("Server exiting")
}

func setupSetting() error {
	setting, err := setting.NewSetting()
	if err != nil {
		return err
	}

	err = setting.ReadSection("Server", &global.ServerSetting)
	if err != nil {
		return err
	}

	err = setting.ReadSection("Database", &global.DatabaseSetting)
	if err != nil {
		return err
	}

	err = setting.ReadSection("JWT", &global.JwtSetting)
	if err != nil {
		return err
	}
	global.JwtSetting.Expire *= time.Second

	err = setting.ReadSection("Redis", &global.RedisSetting)
	if err != nil {
		return err
	}

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
