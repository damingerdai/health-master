package api

import (
	"strings"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// create a user height record godoc
//
//	@Summary		create a user height record
//	@Description	create a new record for user height
//	@Tags			user_height
//	@Accept			json
//	@Produce		json
//	@Param			user_height	body	model.UserHeight	true	"create a user height record"
//	@Security		BearerAuth
//	@Success		200	{object}	model.UserHeightVO	"success"
//	@Failure		400	{object}	errcode.Error		"bad request error"
//	@Failure		500	{object}	errcode.Error		"internal server error"
//	@Router			/api/v1/height [post]
func CreateUserHeight(c *gin.Context) {
	var err error
	var userHeight model.UserHeight
	res := response.NewResponse(c)
	err = c.ShouldBindJSON(&userHeight)
	if err != nil {
		global.Logger.Error("fail bing json request", zap.Error(err))
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	srvs := getServices()
	userHeightService := srvs.UserHeightService
	userHeigthVo, err := userHeightService.Create(c, &userHeight)
	if err != nil {
		global.Logger.Error("fail to create user height", zap.String("userId", userHeight.UserId), zap.Float64("height", userHeight.Height), zap.Time("recordDate", userHeight.RecordDate), zap.Error(err))
		res.ToErrorResponse(errcode.ServerError)
		return
	}
	res.ToResponse(userHeigthVo)
}

// list user height records godoc
//
//	@Summary		list user height records
//	@Description	get paginated height records for a user. If userId is not provided, the user is resolved from the access token.
//	@Tags			user_height
//	@Accept			json
//	@Produce		json
//	@Param			userId		query		string	false	"User ID"
//	@Param			page		query		int		false	"Page number"	default(1)
//	@Param			limit		query		int		false	"Number of records per page"	default(5)
//	@Param			accessToken	query		string	false	"Access token (alternative to Authorization header)"
//	@Security		BearerAuth
//	@Success		200	{object}	model.ListResponse[model.UserHeightVO]	"success"
//	@Failure		400	{object}	errcode.Error							"bad request error"
//	@Failure		401	{object}	errcode.Error							"unauthorized"
//	@Failure		500	{object}	errcode.Error							"internal server error"
//	@Router			/api/v1/heights [get]
func ListUserHeights(c *gin.Context) {
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
		global.Logger.Debug("list a single user height records", zap.String("Authorization", token))
		if len(token) == 0 {
			global.Logger.Error("fail to list a single user height records", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		userId, err = srvs.UserService.GetUserIdByAuthorization(c, token)
		if err != nil {
			global.Logger.Error("fail to list a single user height records", zap.Error(err))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		if len(userId) == 0 {
			global.Logger.Error("fail to list a single user height records", zap.Error(errcode.UnauthorizedAuthNotExist))
			resp.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		global.Logger.Info("list a single user height records", zap.String("UserId", userId))
	}
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	global.Logger.Debug("list a single user height records", zap.String("UserId", userId), zap.String("Page", page), zap.String("Limit", limit))
	userHeightService := srvs.UserHeightService
	res, err := userHeightService.PagingQueryByUserId(c.Request.Context(), userId, limit, page)
	if err != nil {
		global.Logger.Error("fail to list a single user height records", zap.Error(err))
		resp.ToErrorResponse(errcode.ServerError)
		return
	}
	resp.ToResponse(res)
}
