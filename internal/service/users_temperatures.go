package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type UsersTemperaturesService struct {
	userTemperatureRepository repository.UserTemperatureRepository
}

func NewUsersTemperaturesService(userTemperatureRepository repository.UserTemperatureRepository) *UsersTemperaturesService {
	return &UsersTemperaturesService{userTemperatureRepository}
}

func (service *UsersTemperaturesService) Create(ctx context.Context, userTemperature *model.UserTemperature) error {
	err := service.userTemperatureRepository.Create(ctx, userTemperature)
	if err != nil {
		return err
	}
	return nil
}

func (service *UsersTemperaturesService) Find(ctx context.Context, id string) (*model.UserTemperature, error) {
	ut, err := service.userTemperatureRepository.Find(ctx, id)
	if err != nil {
		return nil, err
	}
	return ut, nil
}

func (service *UsersTemperaturesService) List(ctx context.Context, userId string) (*[]model.UserTemperature, error) {
	uts, err := service.userTemperatureRepository.List(ctx, userId)
	if err != nil {
		return nil, err
	}
	return uts, nil
}

func (service *UsersTemperaturesService) PagingQueryByUserId(ctx context.Context, userId, page, limit string) (*model.ListResponse[model.UserTemperature], error) {
	if len(userId) == 0 {
		return nil, errors.New("userId is required")
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, fmt.Errorf("%s", fmt.Sprintf("page %s should be integer", page))
	}
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return nil, fmt.Errorf("%s", fmt.Sprintf("limit %s should be integer", limit))
	}
	records, err := service.userTemperatureRepository.PagingQueryByUserId(ctx, userId, pageInt, limitInt)
	if err != nil {
		return nil, err
	}
	count, err := service.userTemperatureRepository.Count(ctx, userId)
	if err != nil {
		return nil, err
	}
	resp := model.ListResponse[model.UserTemperature]{
		Data:  *records,
		Count: count,
	}

	return &resp, err

}
