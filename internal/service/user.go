package service

import (
	"fmt"
	"time"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/util"
)

type UserService struct {
	userRepository *repository.UserRepository
}

func NewUserService(userRepository *repository.UserRepository) *UserService {
	return &UserService{userRepository}
}

func (userService *UserService) Create(user *model.User) error {
	existUser, err := userService.userRepository.FindByUserName(user.Username)
	if err != nil {
		return fmt.Errorf("fail to create user: %s", err.Error())

	}
	if existUser != nil || existUser.Id != "" {
		return fmt.Errorf("username(%s) is exited", user.Username)
	}
	user.Password = util.GetMd5Hash(user.Password)
	now := time.Now()
	user.CreatedAt = &now
	user.UpdatedAt = &now
	err = userService.userRepository.Create(user)
	if err != nil {
		return fmt.Errorf("fail to create user: %s", err.Error())
	}
	return nil
}

func (userService *UserService) Find(id string) (*model.User, error) {
	return userService.userRepository.Find(id)
}

func (userService *UserService) FindByUserName(username string) (*model.User, error) {
	return userService.userRepository.Find(username)
}
