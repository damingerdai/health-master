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

func (self *UserRepository) Create(user *model.User) error {
	result := self.db.Create(user)
	if result.Error != nil {
		return errors.Unwrap(result.Error)
	}
	return nil
}

func (self *UserRepository) Find(id string) (*model.User, error) {
	var user model.User
	result := self.db.First(&user, "id = ?", id).Where("deleted_at IS NULL")
	if result.Error != nil {
		return nil, errors.Unwrap(result.Error)
	}
	return &user, nil
}
