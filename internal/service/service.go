package service

import (
	"github.com/damingerdai/health-master/internal/repository"
	"gorm.io/gorm"
)

type srv struct {
	db *gorm.DB

	UserService              *UserService
	TokenService             *TokenService
	UserBloodPressureService *UserBloodPressureService
}

func New(db *gorm.DB) *srv {

	repo := repository.New(db)

	return &srv{
		db: db,

		UserService:              NewUserService(repo.UserRepository),
		TokenService:             NewTokenService(repo.UserRepository),
		UserBloodPressureService: NewUserBloodPressureService(repo.UserBloodPressureRepository),
	}
}
