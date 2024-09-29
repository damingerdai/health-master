package service

import (
	"context"
	"errors"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type UserHeightService struct {
	userRespository      *repository.UserRepository
	userHeightRepository *repository.UserHeightRepository
}

func NewUserHeightService(userRespository *repository.UserRepository, userHeightRepository *repository.UserHeightRepository) *UserHeightService {
	return &UserHeightService{
		userRespository:      userRespository,
		userHeightRepository: userHeightRepository,
	}
}

func (heightService *UserHeightService) Create(ctx context.Context, height *model.UserHeight) (*model.UserHeightVO, error) {
	var err error
	user, err := heightService.userRespository.Find(ctx, height.UserId)
	if err != nil {
		return nil, err
	}
	if user == nil || user.Id == "" {
		return nil, errors.New("user id is invalid")
	}
	err = heightService.userHeightRepository.Create(ctx, height)
	if err != nil {
		return nil, err
	}
	uhv := &model.UserHeightVO{
		UserHeight: *height,
		User:       user,
	}
	return uhv, nil
}
