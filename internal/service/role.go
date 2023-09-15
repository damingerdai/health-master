package service

import (
	"context"

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

func (roleService *RoleService) List(ctx context.Context) (*[]model.Role, error) {
	return roleService.roleRepository.List(ctx)
}

func (roleService *RoleService) FindByName(ctx context.Context, name string) (*model.Role, error) {
	return roleService.roleRepository.FindByName(ctx, name)
}
