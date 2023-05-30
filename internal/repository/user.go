package repository

import (
	"errors"
	"fmt"

	"github.com/damingerdai/health-master/internal/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db}
}

func (userRepository *UserRepository) Create(user *model.User) error {
	result := userRepository.db.Create(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (userRepository *UserRepository) Find(id string) (*model.User, error) {
	var user model.User
	result := userRepository.db.First(&user, "id = ?", id).Where("deleted_at IS NULL")
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (userRepository *UserRepository) FindByUserName(username string) (*model.User, error) {
	var user model.User
	result := userRepository.db.First(&user, "username = ?", username).Where("deleted_at IS NULL")
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return &user, nil
}
