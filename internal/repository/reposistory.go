package repository

import "gorm.io/gorm"

type repo struct {
	db *gorm.DB

	UserRepository              *UserRepository
	UserBloodPressureRepository *UserBloodPressureRepository
}

func New(db *gorm.DB) *repo {
	return &repo{
		db: db,

		UserRepository:              NewUserRepository(db),
		UserBloodPressureRepository: NewUserBloodPressureRepository(db),
	}
}
