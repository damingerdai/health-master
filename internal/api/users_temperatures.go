package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
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
		service := service.New(conn, global.Logger)
		user, err := service.UserService.Find(c, userTemperature.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = service.UserTemperatureService.Create(c, &userTemperature)
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
		service := service.New(conn, global.Logger)
		ut, err := service.UserTemperatureService.Find(c, id)
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

// list all user temperature records godoc
//
//	@Summary		list all user temperature records
//	@Description	list all user temperature records for a user
//	@Tags			user_temperature
//	@Accept			json
//	@Produce		json
//	@Param			userId	query	string	false	"user id"
//	@Security		BearerAuth
//	@Success		200	{array}		model.UserTemperature	"success"
//	@Failure		400	{object}	errcode.Error			"bad request error"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/user-temperatures [get]
func ListUsersTemperatures(c *gin.Context) {
	resp := response.NewResponse(c)
	service := service.New(global.DBEngine, global.Logger)
	userId := c.Query("userId")
	if userId == "" {
		userIdInContext, exists := c.Get(contants.UserContext)
		if !exists {
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
		userId, _ = userIdInContext.(string)
		if userId == "" {
			resp.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}
	}
	uts, err := service.UserTemperatureService.List(c, userId)
	if err != nil {
		resp.ToErrorResponse(errcode.ListUserTemperatureError)
	} else {
		resp.ToResponse(uts)
	}

}
