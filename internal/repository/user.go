package repository

import (
	"errors"

	"github.com/damingerdai/health-master/internal/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db}
}

func (ur *UserRepository) Create(user *model.User) error {
	result := ur.db.Create(user)
	if result.Error != nil {
		return errors.Unwrap(result.Error)
	}
	return nil
}
