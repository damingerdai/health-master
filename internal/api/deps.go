package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/service"
)

var appServices *service.Services

func SetServices(s *service.Services) {
	appServices = s
}

func getServices() *service.Services {
	if appServices != nil {
		return appServices
	}

	return service.New(global.DBEngine, global.Logger, service.WithTotpSetting(global.TotpSetting))
}

func getTxServices(conn db.Connection) *service.Services {
	return service.New(conn, global.Logger, service.WithTotpSetting(global.TotpSetting))
}
