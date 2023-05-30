package service

import (
	"github.com/damingerdai/health-master/internal/repository"
	"gorm.io/gorm"
)

type srv struct {
	db *gorm.DB

	RoleService              *RoleService
	UserService              *UserService
	TokenService             *TokenService
	UserBloodPressureService *UserBloodPressureService
}

func New(db *gorm.DB) *srv {

	repo := repository.New(db)
	roleRepository := repo.RoleRepository
	userRepository := repo.UserRepository
	userRoleRepository := repo.UserRoleRepository
	userBloodPressureRepository := repo.UserBloodPressureRepository

	return &srv{
		db: db,

		RoleService:              NewRoleService(roleRepository),
		UserService:              NewUserService(userRepository, roleRepository, userRoleRepository),
		TokenService:             NewTokenService(userRepository),
		UserBloodPressureService: NewUserBloodPressureService(userBloodPressureRepository),
	}
}
