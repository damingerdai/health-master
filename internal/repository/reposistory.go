package repository

import "github.com/damingerdai/health-master/internal/db"

type repo struct {
	db db.Connection

	RoleRepository              *RoleRepository
	UserRepository              *UserRepository
	UserBloodPressureRepository *UserBloodPressureRepository
	UserRoleRepository          *UserRoleRepository
	WeightRecordRepository      *WeightRecordRepository
	UserHeightRepository        *UserHeightRepository
	UserTemperatureRepository   *UserTemperatureRepository
}

func New(db db.Connection) *repo {
	return &repo{
		db: db,

		RoleRepository:              NewRoleRepository(db),
		UserRepository:              NewUserRepository(db),
		UserBloodPressureRepository: NewUserBloodPressureRepository(db),
		UserRoleRepository:          NewUserRoleRepository(db),
		WeightRecordRepository:      NewWeigthRecordRepository(db),
		UserHeightRepository:        NewUserHeightRepository(db),
		UserTemperatureRepository:   NewUserTemperatureRepository(db),
	}
}
