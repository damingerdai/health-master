package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func ListRoles(c *gin.Context) {
	response := response.NewResponse(c)
	roleRepository := repository.NewRoleRepository(global.DBEngine)
	roleService := service.NewRoleRepository(roleRepository)

	roles, err := roleService.List()
	if err != nil {
		response.ToErrorResponse(errcode.ListRoleError)
		return
	}
	response.ToResponse(roles)
}
