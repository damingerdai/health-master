package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func ListRoles(c *gin.Context) {
	res := response.NewResponse(c)
	srv := service.New(global.DBEngine)
	roleService := srv.RoleService

	roles, err := roleService.List()
	if err != nil {
		res.ToErrorResponse(errcode.ListRoleError)
		return
	}
	res.ToResponse(roles)
}
