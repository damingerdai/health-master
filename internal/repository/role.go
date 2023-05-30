package repository

import (
	"errors"
	"fmt"

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

func (roleRepo *RoleRepository) FindByName(name string) (*model.Role, error) {
	var role model.Role
	err := roleRepo.db.First(&role, "name = ?", name).Where("deleted_at IS NULL").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}
