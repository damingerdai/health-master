package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/logger"
	"github.com/damingerdai/health-master/internal/routers"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/gin-gonic/gin"
)

func init() {
	var err = setupSetting()
	if err != nil {
		panic("fail to setup server: " + err.Error())
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
	s.ListenAndServe()
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

	return nil
}
