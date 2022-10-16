package repository

import (
	"errors"

	"github.com/damingerdai/health-master/internal/model"
	"gorm.io/gorm"
)

type UserBloodPressureRepository struct {
	db *gorm.DB
}

func NewUserBloodPressureRepository(db *gorm.DB) *UserBloodPressureRepository {
	return &UserBloodPressureRepository{db}
}

func (userBloodPressureRepository *UserBloodPressureRepository) Create(userBloodPressure *model.UserBloodPressure) error {
	result := userBloodPressureRepository.db.Create(userBloodPressure)
	if result.Error != nil {
		return errors.Unwrap(result.Error)
	}
	return nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) Find(id string) (*model.UserBloodPressure, error) {
	var userBloodPressure model.UserBloodPressure
	result := userBloodPressureRepository.db.First(&userBloodPressure, "id = ?", id).Where("deleted_at IS NULL")
	if result.Error != nil {
		return nil, errors.Unwrap(result.Error)
	}
	return &userBloodPressure, nil
}
