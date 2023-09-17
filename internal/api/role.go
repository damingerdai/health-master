package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

// Get all roles godoc
//
//	@Summary		get all roles
//	@Description	get all roles
//	@Tags			roles
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	model.Role		"sucess"
//	@Failure		400	{object}	errcode.Error	"bad request error"
//	@Failure		500	{object}	errcode.Error	"internal server error"
//	@Router			/api/v1/roles [get])
func ListRoles(c *gin.Context) {
	res := response.NewResponse(c)
	srv := service.New(global.DBEngine)
	roleService := srv.RoleService

	roles, err := roleService.List(c)
	if err != nil {
		res.ToErrorResponse(errcode.ListRoleError)
		return
	}
	res.ToResponse(roles)
}
