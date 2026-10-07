package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"

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

func (heightService *UserHeightService) PagingQueryByUserId(ctx context.Context, userId, limit, page string) (*model.ListResponse[model.UserHeightVO], error) {
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
	user, err := heightService.userRespository.Find(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("fail to find user which user id %s", userId)
	}
	records, err := heightService.userHeightRepository.PagingQueryByUserId(ctx, userId, pageInt, limitInt)
	if err != nil {
		return nil, err
	}
	count, err := heightService.userHeightRepository.Count(ctx, userId)
	if err != nil {
		return nil, err
	}

	resp := &model.ListResponse[model.UserHeightVO]{
		Data:  make([]model.UserHeightVO, 0, len(records)),
		Count: count,
	}
	for _, record := range records {
		resp.Data = append(resp.Data, model.UserHeightVO{
			UserHeight: *record,
			User:       user,
		})
	}

	return resp, nil
}
