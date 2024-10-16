package api

import (
	"errors"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

// create a user godoc
//
//	@Summary		create a user
//	@Description	create a new user
//	@Tags			user
//	@Accept			json
//	@Produce		json
//	@Param			user	body	model.User	true	"create a user"
//	@Security		BearerAuth
//	@Success		200	{object}	model.User		"sucess"
//	@Failure		400	{object}	errcode.Error	"bad request error"
//	@Failure		500	{object}	errcode.Error	"internal server error"
//	@Router			/api/v1/user [post]
func CreateUser(c *gin.Context) {
	var err error
	var user model.User
	res := response.NewResponse(c)
	err = c.ShouldBindJSON(&user)
	if err != nil {
		res.ToErrorResponse(errcode.InvalidParams)
		return
	}
	db.NewTransaction(c, global.DBEngine, func(conn db.Connection) error {
		var err error
		service := service.New(conn, global.Logger)
		userService := service.UserService
		fullUser, err := userService.Create(c, &user)
		if err != nil {
			global.Logger.Error(err.Error())
			if errCodeError := new(errcode.Error); errors.As(err, &errCodeError) {
				res.ToErrorResponse(errCodeError)
			} else {
				res.ToErrorResponse(errcode.CreateUserError)
			}
			return err
		}
		fullUser.Password = ""
		res.ToResponse(fullUser)

		return nil
	})
}

// get user godoc
//
//	@Summary		get user
//	@Description	get user by user id
//	@Tags			user
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string			true	"user id"
//	@Success		200	{object}	model.User		"sucess"
//	@Failure		400	{object}	errcode.Error	"bad request error"
//	@Failure		500	{object}	errcode.Error	"internal server error"
//	@Router			/api/v1/user/{id} [get]
func GetUser(c *gin.Context) {
	res := response.NewResponse(c)
	id := c.Param("id")
	services := service.New(global.DBEngine, global.Logger)
	userService := services.UserService

	user, err := userService.Find(c, id)
	if err != nil {
		res.ToErrorResponse(errcode.ServerError)
		return
	}
	user.Password = ""
	res.ToResponse(user)
}

// get currentuser godoc

// @Summary		get currentuser
// @Description	get user by user id
// @Tags			user
// @Accept			json
// @Produce		json
// @Param			Authorization	header	string	true	"Insert your access token"	default(Bearer <Add access token here>)
// @Security		BearerAuth
// @Success		200	{object}	model.User		"sucess"
// @Failure		400	{object}	errcode.Error	"bad request error"
// @Failure		500	{object}	errcode.Error	"internal server error"
// @Router			/api/v1/user/ [get]
func GetCurrentUser(c *gin.Context) {
	response := response.NewResponse(c)
	services := service.New(global.DBEngine, global.Logger)
	userId := c.GetString("UserId")
	if userId == "" {
		var token string
		if s, exist := c.GetQuery("Authorization"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
		}
		if token == "" {
			response.ToErrorResponse(errcode.NotFoundAuthorization)
			return
		}

		userService := services.UserService
		tokenService := services.TokenService

		claims, err := tokenService.ParseToken(token[7:])
		if err != nil {
			response.ToErrorResponse(errcode.UnauthorizedTokenError)
			return
		}
		userId := claims.UserId
		user, err := userService.Find(c, userId)
		if err != nil {
			response.ToErrorResponse(errcode.UnauthorizedTokenError)
			return
		}
		if user == nil {
			response.ToErrorResponse(errcode.UnauthorizedAuthNotExist)
			return
		}
		user.Password = ""
		response.ToResponse(user)

	} else {
		userService := services.UserService
		user, err := userService.Find(c, userId)
		if err != nil {
			response.ToErrorResponse(errcode.ServerError)
			return
		}
		user.Password = ""
		response.ToResponse(user)
	}
}
