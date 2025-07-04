package middleware

import (
	"errors"
	"regexp"
	"strings"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/service"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/server/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

func JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		url := c.Request.URL.String()
		if ok, _ := regexp.MatchString("^/api/v1/(token|ping|tmptoken)$", url); ok {
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
		if s, exist := c.GetQuery("accessToken"); exist {
			token = s
		} else {
			token = c.GetHeader("Authorization")
			token = strings.TrimPrefix(token, "Bearer ")
		}
		global.Logger.Debug("JWT middleware", zap.String("url", url), zap.String("token", token), zap.String("method", c.Request.Method), zap.String("remote_addr", c.Request.RemoteAddr))
		if token == "" {
			ecode = errcode.NotFoundAuthorization
		} else {
			srv := service.New(global.DBEngine, global.Logger)
			tokenService := srv.TokenService
			claims, err := tokenService.ParseToken(token)
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
