package service

import (
	"context"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/util"
)

type UserService struct {
	userRepository     *repository.UserRepository
	roleRepository     *repository.RoleRepository
	userRoleRepository *repository.UserRoleRepository
}

func NewUserService(
	userRepository *repository.UserRepository,
	roleRepository *repository.RoleRepository,
	userRoleRepository *repository.UserRoleRepository) *UserService {
	return &UserService{
		userRepository:     userRepository,
		roleRepository:     roleRepository,
		userRoleRepository: userRoleRepository,
	}
}

func (userService *UserService) Create(ctx context.Context, user *model.User) (*model.FullUser, error) {
	existUser, err := userService.userRepository.FindByUserName(ctx, user.Username)
	if err != nil {
		return nil, fmt.Errorf("fail to create user: %s", err.Error())
	}
	if existUser != nil && existUser.Id != "" {
		return nil, fmt.Errorf("username(%s) is exited", user.Username)
	}
	user.Password = util.GetMd5Hash(user.Password)
	now := time.Now()
	user.CreatedAt = &now
	user.UpdatedAt = &now
	err = userService.userRepository.Create(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("fail to create user: %s", err.Error())

	}
	role, err := userService.roleRepository.FindByName(ctx, "users")
	if err != nil {
		return nil, fmt.Errorf("fail to get role with '%s' -> %s ", "users", err.Error())
	}
	_, err = userService.userRoleRepository.Create(ctx, user.Id, role.Id)
	if err != nil {
		return nil, err
	}

	if err != nil {
		return nil, fmt.Errorf("fail to create user role: %s", err.Error())
	}
	fullUser := &model.FullUser{
		User: *user,
		Role: *role,
	}
	return fullUser, nil
}

func (userService *UserService) Find(ctx context.Context, id string) (*model.User, error) {
	return userService.userRepository.Find(ctx, id)
}

func (userService *UserService) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	return userService.userRepository.FindByUserName(ctx, username)
}
