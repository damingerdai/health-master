package service

import (
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/repository"
)

type srv struct {
	db db.Connection

	RoleService              *RoleService
	UserService              *UserService
	TokenService             *TokenService
	UserBloodPressureService *UserBloodPressureService
	WeightRecordService      *WeightRecordService
}

func New(db db.Connection) *srv {
	repo := repository.New(db)
	roleRepository := repo.RoleRepository
	userRepository := repo.UserRepository
	userRoleRepository := repo.UserRoleRepository
	userBloodPressureRepository := repo.UserBloodPressureRepository
	weigthRecordRepository := repo.WeightRecordRepository

	return &srv{
		db: db,

		RoleService:              NewRoleService(roleRepository),
		UserService:              NewUserService(userRepository, roleRepository, userRoleRepository),
		TokenService:             NewTokenService(userRepository),
		UserBloodPressureService: NewUserBloodPressureService(userBloodPressureRepository),
		WeightRecordService:      NewWeightRecordService(weigthRecordRepository, userRepository),
	}
}
