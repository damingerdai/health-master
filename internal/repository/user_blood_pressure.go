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
	result := userBloodPressureRepository.db.Joins("users").First(&userBloodPressure, "id = ?", id).Where("deleted_at IS NULL")
	if result.Error != nil {
		return nil, errors.Unwrap(result.Error)
	}
	return &userBloodPressure, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) List() (*[]model.UserBloodPressure, error) {
	var ubps []model.UserBloodPressure
	result := userBloodPressureRepository.db.Joins("User").Where("deleted_at IS NULL").Find(&ubps)
	if result.Error != nil {
		return nil, errors.Unwrap(result.Error)
	}
	return &ubps, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) ListByUserId(userId string, page, limit int) (*[]model.UserBloodPressure, error) {
	var ubps []model.UserBloodPressure
	result := userBloodPressureRepository.db.Joins("User").Where("user_blood_pressure.user_id", userId).Where("user_blood_pressure.deleted_at IS NULL").Limit(limit).Offset(limit * (page - 1)).Order("user_blood_pressure.log_datetime desc").Find(&ubps)
	if result.Error != nil {
		return nil, errors.Unwrap(result.Error)
	}

	return &ubps, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) Count(userId string) (int64, error) {
	var num int64
	userBloodPressureRepository.db.Table("user_blood_pressure").Joins("users").Where("user_id", userId).Where("deleted_at IS NULL").Count(&num)

	return num, nil
}
