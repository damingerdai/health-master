package service

import (
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type RoleService struct {
	roleRepository *repository.RoleRepository
}

func NewRoleService(roleRepository *repository.RoleRepository) *RoleService {
	return &RoleService{
		roleRepository: roleRepository,
	}
}

func (roleService *RoleService) List() (*[]model.Role, error) {
	return roleService.roleRepository.List()
}

func (roleService *RoleService) FindByName(name string) (*model.Role, error) {
	return roleService.roleRepository.FindByName(name)
}
