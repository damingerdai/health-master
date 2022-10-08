package api

import (
	"net/http"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var user model.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userService := service.NewUserService(repository.NewUserRepository(global.DBEngine))
	if err := userService.Create(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	user.CreatedAt = nil
	user.UpdatedAt = nil
	user.Password = ""
	c.JSON(http.StatusOK, user)
}

func GetUser(c *gin.Context) {
	var id = c.Param("id")

	userService := service.NewUserService(repository.NewUserRepository(global.DBEngine))

	user, err := userService.Find(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)

}
