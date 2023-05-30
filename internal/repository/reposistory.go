package repository

import "gorm.io/gorm"

type repo struct {
	db *gorm.DB

	RoleRepository              *RoleRepository
	UserRepository              *UserRepository
	UserBloodPressureRepository *UserBloodPressureRepository
	UserRoleRepository          *UserRoleRepository
}

func New(db *gorm.DB) *repo {
	return &repo{
		db: db,

		RoleRepository:              NewRoleRepository(db),
		UserRepository:              NewUserRepository(db),
		UserBloodPressureRepository: NewUserBloodPressureRepository(db),
		UserRoleRepository:          NewUserRoleRepository(db),
	}
}
