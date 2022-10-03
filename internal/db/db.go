package db

import (
	"errors"

	"github.com/damingerdai/health-master/pkg/setting"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDBEngine(databaseSetting *setting.DatabaseSettingS) (*gorm.DB, error) {
	dsn := databaseSetting.DBConnString()
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	if err = sqlDB.Ping(); err != nil {
		sqlDB.Close()
		return nil, errors.New("fail to tcp " + databaseSetting.DBConnString())
	}

	return db, nil
}
