package service

import (
	"context"
	"fmt"
	"strconv"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type WeightRecordService struct {
	weightRecordRepository *repository.WeightRecordRepository
}

func NewWeightRecordService(weightRecordRepository *repository.WeightRecordRepository) *WeightRecordService {
	return &WeightRecordService{weightRecordRepository: weightRecordRepository}
}

func (wieghtRecordService *WeightRecordService) Create(ctx context.Context, weightRecord *model.WeightRecord) error {
	id, err := wieghtRecordService.weightRecordRepository.Create(ctx, weightRecord)
	if err != nil {
		return err
	}
	weightRecord.Id = *id

	return nil
}

func (weightRecordService *WeightRecordService) PagingQueryByUserId(ctx context.Context, userId, limit, page string) (*model.ListResponse[model.WeightRecord], error) {
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("page %s should be integer", page))
	}
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("limit %s should be integer", limit))
	}
	records, err := weightRecordService.weightRecordRepository.PagingQueryByUserId(ctx, userId, pageInt, limitInt)
	if err != nil {
		return nil, err
	}
	count, err := weightRecordService.weightRecordRepository.Count(ctx, userId)
	if err != nil {
		return nil, err
	}

	resp := model.ListResponse[model.WeightRecord]{}
	if records != nil {
		resp.Data = *records
	} else {
		data := make([]model.WeightRecord, 0)
		resp.Data = data
	}
	resp.Count = count

	return &resp, nil
}
