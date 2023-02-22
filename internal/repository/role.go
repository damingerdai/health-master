package repository

import (
	"github.com/damingerdai/health-master/internal/model"
	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{
		db: db,
	}
}

func (roleRepo *RoleRepository) List() (*[]model.Role, error) {
	var roles []model.Role
	roleRepo.db.Find(&roles)

	return &roles, nil
}
