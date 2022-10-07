package service

import (
	"errors"
	"fmt"

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

func (self *UserService) Create(user *model.User) error {
	user.Password = util.GetMd5Hash(user.Password)
	err := self.userRepository.Create(user)
	if err != nil {
		return errors.New(fmt.Sprintf("fail to create user: %s", err.Error()))
	}
	return nil
}

func (self *UserService) Find(id string) (*model.User, error) {
	return self.userRepository.Find(id)
}
