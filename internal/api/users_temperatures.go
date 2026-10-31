package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// create a user temperature record godoc
//
//	@Summary		create a user temperature record
//	@Description	create a new record for user temperature
//	@Tags			user_temperature
//	@Accept			json
//	@Produce		json
//	@Param			user_temperature	body	model.UserTemperature	true	"create a user temperature record"
//	@Security		BearerAuth
//	@Success		200	{object}	model.UserTemperature	"success"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/user-temperature [post]
func CreateUsersTemperatures(c *gin.Context) {
	var userTemperature model.UserTemperature
	resp := response.NewResponse(c)
	if err := c.ShouldBindJSON(&userTemperature); err != nil {
		global.Logger.Error("create user temperature with invalid params", zap.Error(err))
		resp.ToErrorResponse(errcode.InvalidParams)
		return
	}

	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		srvs := getTxServices(conn)
		user, err := srvs.UserService.Find(c, userTemperature.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = srvs.UserTemperatureService.Create(c, &userTemperature)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		resp.ToErrorResponse(errcode.CreateUserTemperatureError)
	} else {
		resp.ToResponse(userTemperature)
	}
}

// get a user temperature record godoc
//
//	@Summary		get a user temperature record
//	@Description	get a user temperature record by id
//	@Tags			user_temperature
//	@Accept			json
//	@Produce		json
//	@Param			id	path	string	true	"user temperature id"
//	@Security		BearerAuth
//	@Success		200	{object}	model.UserTemperature	"success"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/user-temperature/{id} [get]
func GetUsersTemperatures(c *gin.Context) {
	id := c.Param("id")
	resp := response.NewResponse(c)
	var userTemperature *model.UserTemperature
	err := db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		srvs := getTxServices(conn)
		ut, err := srvs.UserTemperatureService.Find(c, id)
		if err != nil {
			return err
		}
		userTemperature = ut
		return nil
	})
	if err != nil {
		resp.ToErrorResponse(errcode.GetUserTemperatureError)
	} else {
		resp.ToResponse(userTemperature)
	}
}

// ListUsersTemperatures godoc
//
//	@Summary		list paginated user temperature records
//	@Description	List temperature records ordered by record date descending. If userId is omitted or empty, use the authenticated user's ID. The response contains the current page of records and the total record count.
//	@Tags			user_temperature
//	@Accept			json
//	@Produce		json
//	@Param			userId	query	string	false	"User ID; defaults to the authenticated user's ID"
//	@Param			page	query	int		false	"Page number" default(1)
//	@Param			limit	query	int		false	"Records per page" default(5)
//	@Security		BearerAuth
//	@Success		200	{object}	model.APIResponseSwagger[model.ListResponse[model.UserTemperature]]	"success"
//	@Failure		401	{object}	errcode.Error	"invalid or expired authentication token"
//	@Failure		500	{object}	errcode.Error	"missing or invalid user context, invalid pagination parameters, or failed to retrieve temperature records"
//	@Router			/api/v1/user-temperatures [get]
func ListUsersTemperatures(c *gin.Context) {
	resp := response.NewResponse(c)
	srvs := getServices()
	userId := c.Query("userId")
	if userId == "" {
		userIdInContext, exists := c.Get(contants.UserContext)
		if !exists {
			global.Logger.Warn("list user temperatures: user context not found", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		var ok bool
		userId, ok = userIdInContext.(string)
		if !ok {
			global.Logger.Warn("list user temperatures: invalid user context type", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		if userId == "" {
			global.Logger.Warn("list user temperatures: empty user ID in context", zap.Error(errcode.NotFoundAuthorization))
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
	}
	global.Logger.Debug("list user temperatures", zap.String("userId", userId))
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "5")
	uts, err := srvs.UserTemperatureService.PagingQueryByUserId(c.Request.Context(), userId, page, limit)
	if err != nil {
		global.Logger.Error("failed to list user temperatures", zap.String("userId", userId), zap.Error(err))
		resp.ToErrorResponse(errcode.ListUserTemperatureError)
		return
	}
	global.Logger.Info("listed user temperatures", zap.String("userId", userId), zap.Int64("count", uts.Count))
	resp.ToResponse(uts)

}
