package service

import (
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

func (userService *UserService) Create(user *model.User) (*model.FullUser, error) {
	existUser, err := userService.userRepository.FindByUserName(user.Username)
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
	err = userService.userRepository.Create(user)
	if err != nil {
		return nil, fmt.Errorf("fail to create user: %s", err.Error())

	}
	role, err := userService.roleRepository.FindByName("users")
	if err != nil {
		return nil, fmt.Errorf("fail to get role with '%s' -> %s ", "users", err.Error())
	}
	_, err = userService.userRoleRepository.Create(user.Id, role.Id)
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

func (userService *UserService) Find(id string) (*model.User, error) {
	return userService.userRepository.Find(id)
}

func (userService *UserService) FindByUserName(username string) (*model.User, error) {
	return userService.userRepository.FindByUserName(username)
}
