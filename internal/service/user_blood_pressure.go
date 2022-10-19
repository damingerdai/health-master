package service

import (
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type UserBloodPressureService struct {
	userBloodPressureRepository *repository.UserBloodPressureRepository
}

func NewUserBloodPressureService(userBloodPressureRepository *repository.UserBloodPressureRepository) *UserBloodPressureService {
	return &UserBloodPressureService{userBloodPressureRepository}
}

func (userBloodPressureService *UserBloodPressureService) Create(userBloodPressure *model.UserBloodPressure) error {
	err := userBloodPressureService.userBloodPressureRepository.Create(userBloodPressure)
	if err != nil {
		return nil
	}
	return nil
}

func (userBloodPressureService *UserBloodPressureService) Find(id string) (*model.UserBloodPressure, error) {
	ubp, err := userBloodPressureService.userBloodPressureRepository.Find(id)
	if err != nil {
		return nil, err
	}
	return ubp, nil
}

func (userBloodPressureService *UserBloodPressureService) List() (*[]model.UserBloodPressure, error) {
	ubps, err := userBloodPressureService.userBloodPressureRepository.List()
	if err != nil {
		return nil, err
	}
	return ubps, nil
}
