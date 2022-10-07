package service

import (
	"errors"
	"fmt"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type UserService struct {
	userRepository *repository.UserRepository
}

func NewUserService(userRepository *repository.UserRepository) *UserService {
	return &UserService{userRepository}
}

func (self *UserService) Create(user *model.User) error {
	err := self.userRepository.Create(user)
	if err != nil {
		return errors.New(fmt.Sprintf("fail to create user: %s", err.Error()))
	}
	return nil
}
