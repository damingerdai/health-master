package service

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/global"
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

	tokenService *TokenService

	logger *zap.Logger
}

func NewUserService(
	userRepository *repository.UserRepository,
	roleRepository *repository.RoleRepository,
	userRoleRepository *repository.UserRoleRepository,
	tokenService *TokenService,
	logger *zap.Logger,
) *UserService {
	return &UserService{
		userRepository:     userRepository,
		roleRepository:     roleRepository,
		userRoleRepository: userRoleRepository,
		tokenService:       tokenService,
		logger:             logger,
	}
}

func (userService *UserService) Create(ctx context.Context, user *model.User) (*model.FullUser, error) {
	existUser, err := userService.userRepository.FindByUserName(ctx, user.Username)
	if err != nil {
		// userService.logger.Error("fail to create user", zap.Error(err))
		global.Logger.Error("fail to create user", zap.Error(err))
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
		userService.logger.Error("fail to create user", zap.Error(err))
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

func (userService *UserService) GetUserIdByAuthorization(ctx context.Context, authorization string) (string, error) {
	if len(authorization) == 0 {
		userService.logger.Error("authorization is empty")
		return "", errcode.NotFoundAuthorization
	}
	// Assuming the tokenService can parse the authorization token and return the user ID
	claims, err := userService.tokenService.ParseToken(authorization)
	if err != nil {
		userService.logger.Error("fail to parse token", zap.String("authorization", authorization), zap.Error(err))
		if err == errcode.UnauthorizedTokenTimeout {
			return "", errcode.UnauthorizedTokenTimeout
		}
		return "", errcode.UnauthorizedTokenError
	}
	if claims == nil {
		userService.logger.Error("claims is nil for authorization", zap.String("authorization", authorization))
		return "", errcode.UnauthorizedTokenTimeout
	}
	// Assuming claims.UserId is the user ID extracted from the token
	userId := claims.UserId
	global.Logger.Debug("get user ID from authorization", zap.String("authorization", authorization), zap.String("userId", userId))
	if len(userId) == 0 {
		userService.logger.Error("user ID is empty for authorization", zap.String("authorization", authorization))
		return "", errcode.UnauthorizedAuthNotExist
	}
	return userId, nil
}

func (userService *UserService) Find(ctx context.Context, id string) (*model.User, error) {
	return userService.userRepository.Find(ctx, id)
}

func (userService *UserService) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	return userService.userRepository.FindByUserName(ctx, username)
}
