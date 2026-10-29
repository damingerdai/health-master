package api

import (
	"fmt"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

func ChangePassword(c *gin.Context) {
	var err error
	var input model.ChangePasswordInput
	res := response.NewResponse(c)
	if err := c.ShouldBindJSON(&input); err != nil {
		res.ToErrorResponseWithDetails(errcode.InvalidParams, err)
		return
	}
	if err != nil {
		fmt.Println("test")
	}
	res.ToResponse(input)
}
