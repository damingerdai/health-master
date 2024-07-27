package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type WeightRecordService struct {
	weightRecordRepository *repository.WeightRecordRepository
	userRepository         *repository.UserRepository
}

func NewWeightRecordService(weightRecordRepository *repository.WeightRecordRepository, userRepository *repository.UserRepository) *WeightRecordService {
	return &WeightRecordService{weightRecordRepository: weightRecordRepository, userRepository: userRepository}
}

func (wieghtRecordService *WeightRecordService) Create(ctx context.Context, weightRecord *model.WeightRecord) error {
	id, err := wieghtRecordService.weightRecordRepository.Create(ctx, weightRecord)
	if err != nil {
		return err
	}
	weightRecord.Id = *id

	return nil
}

func (weightRecordService *WeightRecordService) PagingQueryByUserId(ctx context.Context, userId, limit, page string) (*model.ListResponse[model.WeightRecordVO], error) {
	if len(userId) == 0 {
		return nil, errors.New("userId is required")
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("page %s should be integer", page))
	}
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("limit %s should be integer", limit))
	}
	user, err := weightRecordService.userRepository.Find(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("fail to find user which user id %s", userId)
	}
	records, err := weightRecordService.weightRecordRepository.PagingQueryByUserId(ctx, userId, pageInt, limitInt)
	if err != nil {
		return nil, err
	}
	count, err := weightRecordService.weightRecordRepository.Count(ctx, userId)
	if err != nil {
		return nil, err
	}

	resp := model.ListResponse[model.WeightRecordVO]{}
	if records != nil {
		recordVOs := make([]model.WeightRecordVO, 0, len(*records))
		for _, record := range *records {
			recordVO := model.WeightRecordVO{
				WeightRecord: record,
				User:         user,
			}
			recordVOs = append(recordVOs, recordVO)
		}
		resp.Data = recordVOs
	} else {
		data := make([]model.WeightRecordVO, 0)
		resp.Data = data
	}
	resp.Count = count

	return &resp, nil
}

func (s *WeightRecordService) DeleteWeightRecord(ctx context.Context, id string) error {
	if len(id) == 0 {
		return errors.New("id is required")
	}
	err := s.weightRecordRepository.DeleteWeightRecord(ctx, id)
	if err != nil {
		return err
	}
	return nil
}
