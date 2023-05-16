package middleware

import (
	"errors"
	"regexp"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		url := c.Request.URL.String()
		if ok, _ := regexp.MatchString("^/api/v1/(token|ping)$", url); ok {
			c.Next()
			return
		}
		if ok, _ := regexp.MatchString("^/api/v1/user$", url); ok && c.Request.Method == "POST" {
			c.Next()
			return
		}
		var (
			token string
			ecode = errcode.Success
		)
		if s, exist := c.GetQuery("Authorization"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
		}
		if token == "" {
			ecode = errcode.NotFoundAuthorization
		} else {
			srv := service.New(global.DBEngine)
			tokenService := srv.TokenService
			claims, err := tokenService.ParseToken(token[7:])
			if err != nil {
				if errors.Is(err, jwt.ErrTokenExpired) {
					ecode = errcode.UnauthorizedTokenTimeout
				} else {
					ecode = errcode.UnauthorizedTokenError
				}
			}
			if claims == nil {
				ecode = errcode.UnauthorizedTokenTimeout
			} else {
				c.Set("UserId", claims.UserId)
			}
		}

		if ecode != errcode.Success {
			response := response.NewResponse(c)
			response.ToErrorResponse(ecode)
			c.Abort()
			return
		}

		c.Next()
	}
}
