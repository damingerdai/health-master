package api

import (
	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/contants"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
)

// GetStatisticsSummary godoc
//
//	@Summary		Get statistics summary
//	@Description	Get statistics summary for the current user
//	@Tags			statistics
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	model.StatisticsSummary	"success"
//	@Failure		401	{object}	errcode.Error			"unauthorized"
//	@Failure		500	{object}	errcode.Error			"internal server error"
//	@Router			/api/v1/statistics/summary [get]
func GetStatisticsSummary(c *gin.Context) {
	resp := response.NewResponse(c)
	userIdInContext, exists := c.Get(contants.UserContext)
	if !exists {
		resp.ToErrorResponse(errcode.NotFoundAuthorization)
		return
	}
	userId, _ := userIdInContext.(string)

	srv := service.New(global.DBEngine, global.Logger)
	summary, err := srv.StatisticsService.GetSummary(c, userId)
	if err != nil {
		resp.ToErrorResponse(errcode.ServerError)
		return
	}

	resp.ToResponse(summary)
}
