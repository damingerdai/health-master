package service

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/util"
	"go.uber.org/zap"
)

type UserService struct {
	userRepository     *repository.UserRepository
	roleRepository     *repository.RoleRepository
	userRoleRepository *repository.UserRoleRepository
	logger             *zap.Logger
}

func NewUserService(
	userRepository *repository.UserRepository,
	roleRepository *repository.RoleRepository,
	userRoleRepository *repository.UserRoleRepository,
	logger *zap.Logger,
) *UserService {
	return &UserService{
		userRepository:     userRepository,
		roleRepository:     roleRepository,
		userRoleRepository: userRoleRepository,
		logger:             logger,
	}
}

func (userService *UserService) Create(ctx context.Context, user *model.User) (*model.FullUser, error) {
	existUser, err := userService.userRepository.FindByUserName(ctx, user.Username)
	if err != nil {
		userService.logger.Error("fail to create user", zap.Error(err))
		return nil, errcode.CreateUserError
	}
	if existUser != nil && existUser.Id != "" {
		userService.logger.Error("username already exists", zap.String("username", user.Username))
		return nil, errcode.CreateUplicateUserNameError
	}
	user.Password = util.GetMd5Hash(user.Password)
	now := time.Now()
	user.CreatedAt = &now
	user.UpdatedAt = &now
	err = userService.userRepository.Create(ctx, user)
	if err != nil {
		userService.logger.Error("fail to create user", zap.Error(err))
		return nil, errcode.CreateUserError
	}
	role, err := userService.roleRepository.FindByName(ctx, "users")
	if err != nil {
		userService.logger.Error("fail to get role", zap.String("role", "users"), zap.Error(err))
		return nil, errcode.CreateUserError
	}
	_, err = userService.userRoleRepository.Create(ctx, user.Id, role.Id)
	if err != nil {
		return nil, err
	}
	if err != nil {
		userService.logger.Error("fail to create user role", zap.String("username", user.Username), zap.String("role", role.Name), zap.Error(err))
		return nil, errcode.CreateUserError
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
