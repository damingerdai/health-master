package service

import (
	"context"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type UsersTemperaturesService struct {
	userTemperatureRepository repository.UserTemperatureRepository
}

func NewUsersTemperaturesService(userTemperatureRepository repository.UserTemperatureRepository) *UsersTemperaturesService {
	return &UsersTemperaturesService{userTemperatureRepository}
}

func (usersTemperaturesService *UsersTemperaturesService) Create(ctx context.Context, userTemperature *model.UserTemperature) error {
	err := usersTemperaturesService.userTemperatureRepository.Create(ctx, userTemperature)
	if err != nil {
		return err
	}
	return nil
}

func (usersTemperaturesService *UsersTemperaturesService) Find(ctx context.Context, id string) (*model.UserTemperature, error) {
	ut, err := usersTemperaturesService.userTemperatureRepository.Find(ctx, id)
	if err != nil {
		return nil, err
	}
	return ut, nil
}

func (userBloodPressureService *UsersTemperaturesService) List(ctx context.Context, userId string) (*[]model.UserTemperature, error) {
	uts, err := userBloodPressureService.userTemperatureRepository.List(ctx, userId)
	if err != nil {
		return nil, err
	}
	return uts, nil
}
