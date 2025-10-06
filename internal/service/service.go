package service

import (
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/repository"
	"go.uber.org/zap"
)

type srv struct {
	db     db.Connection
	logger *zap.Logger

	RoleService              *RoleService
	UserService              *UserService
	TokenService             *TokenService
	UserBloodPressureService *UserBloodPressureService
	WeightRecordService      *WeightRecordService
	UserHeightService        *UserHeightService
	UserTemperatureService   *UsersTemperaturesService
}

func New(db db.Connection, logger *zap.Logger) *srv {
	repo := repository.New(db)
	roleRepository := repo.RoleRepository
	userRepository := repo.UserRepository
	userRoleRepository := repo.UserRoleRepository
	userBloodPressureRepository := repo.UserBloodPressureRepository
	weigthRecordRepository := repo.WeightRecordRepository
	userHeightRepository := repo.UserHeightRepository
	userTemperatureRepository := repo.UserTemperatureRepository
	tokenService := NewTokenService(userRepository)

	return &srv{
		db:     db,
		logger: logger,

		RoleService:              NewRoleService(roleRepository),
		UserService:              NewUserService(userRepository, roleRepository, userRoleRepository, tokenService, logger),
		TokenService:             tokenService,
		UserBloodPressureService: NewUserBloodPressureService(userBloodPressureRepository),
		WeightRecordService:      NewWeightRecordService(weigthRecordRepository, userRepository),
		UserHeightService:        NewUserHeightService(userRepository, userHeightRepository),
		UserTemperatureService:   NewUsersTemperaturesService(*userTemperatureRepository),
	}
}
