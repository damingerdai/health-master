package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/xuri/excelize/v2"
)

type UserBloodPressureService struct {
	userBloodPressureRepository *repository.UserBloodPressureRepository
}

func NewUserBloodPressureService(userBloodPressureRepository *repository.UserBloodPressureRepository) *UserBloodPressureService {
	return &UserBloodPressureService{userBloodPressureRepository}
}

func (userBloodPressureService *UserBloodPressureService) Create(ctx context.Context, userBloodPressure *model.UserBloodPressure) error {
	err := userBloodPressureService.userBloodPressureRepository.Create(ctx, userBloodPressure)
	if err != nil {
		return nil
	}
	return nil
}

func (userBloodPressureService *UserBloodPressureService) Find(ctx context.Context, id string) (*model.UserBloodPressure, error) {
	ubp, err := userBloodPressureService.userBloodPressureRepository.Find(ctx, id)
	if err != nil {
		return nil, err
	}
	return ubp, nil
}

func (userBloodPressureService *UserBloodPressureService) List(ctx context.Context) (*[]model.UserBloodPressure, error) {
	ubps, err := userBloodPressureService.userBloodPressureRepository.List(ctx)
	if err != nil {
		return nil, err
	}
	return ubps, nil
}

func (userBloodPressureService *UserBloodPressureService) PagingQueryByUserId(ctx context.Context, userId string, page, limit string) (*model.ListResponse[model.UserBloodPressure], error) {
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("page %s should be integer", page))
	}
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("limit %s should be integer", limit))
	}

	ubps, err := userBloodPressureService.userBloodPressureRepository.PagingQueryByUserId(ctx, userId, pageInt, limitInt)
	if err != nil {
		return nil, err
	}
	count, err := userBloodPressureService.userBloodPressureRepository.Count(ctx, userId)
	if err != nil {
		return nil, err
	}
	resp := model.ListResponse[model.UserBloodPressure]{}
	if ubps != nil {
		resp.Data = *ubps
	} else {
		data := make([]model.UserBloodPressure, 0)
		resp.Data = data
	}
	resp.Count = count

	return &resp, nil
}

func (userBloodPressureService *UserBloodPressureService) Delete(ctx context.Context, id string) error {
	err := userBloodPressureService.userBloodPressureRepository.Delete(ctx, id)
	if err != nil {
		return err
	}
	return nil
}

func (userBloodPressureService *UserBloodPressureService) CreateExcelizeFile(ctx context.Context, userId string) (*excelize.File, error) {
	ubps, err := userBloodPressureService.userBloodPressureRepository.ListByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	f := excelize.NewFile()
	index, err := f.NewSheet("Sheet1")
	if err != nil {
		return nil, err
	}
	f.SetActiveSheet(index)
	f.SetSheetRow("Sheet1", "A1", &[]any{"用户名", "舒张压", "收缩压", "脉搏", "记录时间"})
	for i := range *ubps {
		ubp := (*ubps)[i]
		cell := fmt.Sprintf("A%d", i+2)
		f.SetSheetRow("Sheet1", cell, &[]any{ubp.User.Username, ubp.DiastolicBloodPressure, ubp.SystolicBloodPressure, ubp.Pulse, ubp.CreatedAt})
	}
	return f, nil
}
