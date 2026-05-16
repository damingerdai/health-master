package service

import (
	"context"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
)

type StatisticsService struct {
	userBloodPressureRepository *repository.UserBloodPressureRepository
	weightRecordRepository      *repository.WeightRecordRepository
	userTemperatureRepository   *repository.UserTemperatureRepository
	userHeightRepository        *repository.UserHeightRepository
}

func NewStatisticsService(
	ubpRepo *repository.UserBloodPressureRepository,
	wrRepo *repository.WeightRecordRepository,
	utRepo *repository.UserTemperatureRepository,
	uhRepo *repository.UserHeightRepository,
) *StatisticsService {
	return &StatisticsService{
		userBloodPressureRepository: ubpRepo,
		weightRecordRepository:      wrRepo,
		userTemperatureRepository:   utRepo,
		userHeightRepository:        uhRepo,
	}
}

func (s *StatisticsService) GetSummary(ctx context.Context, userId string) (*model.StatisticsSummary, error) {
	summary := &model.StatisticsSummary{}

	// Latest Blood Pressure
	ubps, err := s.userBloodPressureRepository.PagingQueryByUserId(ctx, userId, 1, 10)
	if err == nil && len(*ubps) > 0 {
		summary.LatestBloodPressure = &(*ubps)[0]
		summary.BloodPressureTrend = make([]*model.UserBloodPressure, len(*ubps))
		for i, ubp := range *ubps {
			summary.BloodPressureTrend[i] = &ubp
		}
	} else {
		summary.BloodPressureTrend = []*model.UserBloodPressure{}
	}

	// Latest Weight
	weights, err := s.weightRecordRepository.PagingQueryByUserId(ctx, userId, 10, 1)
	if err == nil && len(*weights) > 0 {
		summary.LatestWeight = &(*weights)[0]
		summary.WeightTrend = make([]*model.WeightRecord, len(*weights))
		for i, w := range *weights {
			summary.WeightTrend[i] = &w
		}
	} else {
		summary.WeightTrend = []*model.WeightRecord{}
	}

	// Latest Temperature
	temps, err := s.userTemperatureRepository.List(ctx, userId)
	if err == nil && len(*temps) > 0 {
		firstTemp := (*temps)[0]
		summary.LatestTemperature = &model.UserTemperatureRecord{
			UserId:      firstTemp.UserId,
			Temperature: firstTemp.Temperature,
			RecordDate:  firstTemp.RecordDate,
			CreatedAt:   firstTemp.CreatedAt,
			UpdatedAt:   firstTemp.UpdatedAt,
			DeletedAt:   firstTemp.DeletedAt,
		}
		summary.TemperatureTrend = make([]*model.UserTemperature, len(*temps))
		for i, t := range *temps {
			summary.TemperatureTrend[i] = &t
		}
	} else {
		summary.TemperatureTrend = []*model.UserTemperature{}
	}

	// Latest Height
	heights, err := s.userHeightRepository.List(ctx, userId)
	if err == nil && len(heights) > 0 {
		summary.LatestHeight = heights[0]
	}

	return summary, nil
}
