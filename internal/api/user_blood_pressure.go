package api

import (
	"errors"
	"net/http"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateUserBloodPressure(c *gin.Context) {
	var userBloodPressure model.UserBloodPressure

	if err := c.ShouldBindJSON(&userBloodPressure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := global.DBEngine.Transaction(func(tx *gorm.DB) error {
		service := service.New(tx)

		user, err := service.UserService.Find(userBloodPressure.UserId)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.New("no user")
		}

		err = service.UserBloodPressureService.Create(&userBloodPressure)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"data": userBloodPressure})
	}
}

func ListBloodPressures(c *gin.Context) {
	service := service.New(global.DBEngine)

	userBloodPressureService := service.UserBloodPressureService

	ubps, err := userBloodPressureService.List()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"data": ubps})
	}

}
