package api

import (
	"fmt"
	"strings"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// create a weight record godoc
//
// @Summary create a weight record
// @Description Create a weight record. Weight is in kilograms, must be greater than 0 and at most 500. recordDate is an RFC3339 timestamp.
// @Tags weight_record
// @Accept json
// @Produce json
// @Param weight_record body model.WeightRecord true "Weight record with userId, weight and recordDate"
// @Security BearerAuth
// @Success 200 {object} model.APIResponseSwagger[model.WeightRecord] "success"
// @Failure 400 {object} model.ErrorResponseSwagger "invalid request body or weight"
// @Failure 401 {object} model.ErrorResponseSwagger "invalid or expired access token"
// @Failure 500 {object} model.ErrorResponseSwagger "internal server error or missing authorization"
// @Router /api/v1/weight-record [post]
func AddWeightRecord(c *gin.Context) {
	var weightRecord model.WeightRecord
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&weightRecord); err != nil {
		fmt.Print("fail to parse weight record: ", err)
		global.Logger.Info("fail to prase weight record", zap.String("UserId", weightRecord.UserId), zap.Float64("Weight", weightRecord.Weight), zap.Time("RecordDate", weightRecord.RecordDate), zap.Error(err))
		resp.ToErrorResponse(errcode.InvalidParams.WithDetails(err.Error()))
		return
	}
	srv := getServices()
	err := srv.WeightRecordService.Create(c, &weightRecord)
	if err != nil {
		fmt.Print("fail to create weight record: ", err)
		global.Logger.Info("fail to create weight record", zap.String("UserId", weightRecord.UserId), zap.Float64("Weight", weightRecord.Weight), zap.Time("RecordDate", weightRecord.RecordDate), zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(weightRecord)
}

// list weight records godoc
//
// @Summary list weight records
// @Description List weight records with pagination and a total count. When userId is omitted, use the authenticated user. Invalid pagination values currently return HTTP 500.
// @Tags weight_record
// @Produce json
// @Param userId query string false "User ID; defaults to the authenticated user"
// @Param accessToken query string false "Access token alternative to the Authorization header; takes precedence when provided"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Records per page" default(5)
// @Security BearerAuth
// @Success 200 {object} model.APIResponseSwagger[model.ListResponse[model.WeightRecordVO]] "success"
// @Failure 401 {object} model.ErrorResponseSwagger "invalid or expired access token"
// @Failure 500 {object} model.ErrorResponseSwagger "invalid pagination, internal server error or missing authorization"
// @Router /api/v1/weight-records [get]
func ListWeightRecords(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	var userId = c.Query("userId")
	if len(userId) == 0 {
		var (
			err   error
			token string
		)
		if s, exist := c.GetQuery("accessToken"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
			token = strings.TrimPrefix(token, "Bearer ")
		}
		global.Logger.Debug("list a single user weight records", zap.String("Authorization", token))
		if len(token) == 0 {
			global.Logger.Error("fail to list a single user weight records", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		userId, err = srvs.UserService.GetUserIdByAuthorization(c, token)
		if err != nil {
			global.Logger.Error("fail to list a single user weight records", zap.Error(err))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		if len(userId) == 0 {
			global.Logger.Error("fail to list a single user weight records", zap.Error(errcode.UnauthorizedAuthNotExist))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		global.Logger.Info("list a single user weight records", zap.String("UserId", userId))
	}
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	global.Logger.Debug("list a single user weight records", zap.String("UserId", userId), zap.String("Page", page), zap.String("Limit", limit))
	weightRecordService := srvs.WeightRecordService
	res, err := weightRecordService.PagingQueryByUserId(c, userId, limit, page)
	if err != nil {
		global.Logger.Error("fail to list a single user weight records", zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(res)
}

// delete a weight record godoc
//
// @Summary delete a weight record
// @Description Delete a weight record by ID.
// @Tags weight_record
// @Produce json
// @Param id path string true "Weight record ID"
// @Security BearerAuth
// @Success 200 {object} model.APIResponseSwagger[model.WeightRecordDeleteResultSwagger] "success"
// @Failure 401 {object} model.ErrorResponseSwagger "invalid or expired access token"
// @Failure 500 {object} model.ErrorResponseSwagger "deletion failed or missing authorization"
// @Router /api/v1/weight-record/{id} [delete]
func DeleteWeightRecord(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	id := c.Params.ByName("id")
	err := srvs.WeightRecordService.DeleteWeightRecord(c, id)
	if err != nil {
		global.Logger.Info("fail to delete weight record", zap.String("WeightRecordId", id), zap.Error(err))
		resp.ToErrorResponseWithError(errcode.DeleteDeleteWeightRecordError, err)
		return
	}
	resp.ToResponse(gin.H{"success": true})
}
