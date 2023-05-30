package repository

import (
	"time"

	"github.com/damingerdai/health-master/internal/model"
	"gorm.io/gorm"
)

type UserRoleRepository struct {
	db *gorm.DB
}

func NewUserRoleRepository(db *gorm.DB) *UserRoleRepository {
	return &UserRoleRepository{db: db}
}

func (userRoleRepository *UserRoleRepository) Create(userId, roleId string) (string, error) {
	var now = time.Now()
	var userRole = model.UserRole{
		UserId:    userId,
		RoleId:    roleId,
		CreatedAt: &now,
		UpdatedAt: &now,
	}
	result := userRoleRepository.db.Create(&userRole)
	if result.Error != nil {
		return "", result.Error
	}
	return userRole.Id, nil
}
