package server

import (
	"fmt"
	"net/http"

	"github.com/damingerdai/health-master/internal/logger"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Server interface {
	Run() error
}

func New(server *http.Server, runMode string) (Server, error) {
	log, err := logger.NewLogger("debug")
	if err != nil {
		return nil, err
	}
	defer log.Sync()
	log.Debug("health master is in run mode:", zap.String("runMode", runMode))

	gin.SetMode(runMode)
	if runMode == "release" {
		return NewProdServer(server), nil
	} else if runMode == "debug" {
		return NewDevServer(server), nil
	}

	return nil, fmt.Errorf("no support %s server", runMode)
}
