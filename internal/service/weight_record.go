package service

import (
	"context"

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
