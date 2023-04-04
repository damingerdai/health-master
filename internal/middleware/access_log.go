package middleware

import (
	"bytes"
	"fmt"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/gin-gonic/gin"
	"github.com/mssola/user_agent"
)

type AccessLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w AccessLogWriter) Write(p []byte) (int, error) {
	if n, err := w.body.Write(p); err != nil {
		return n, err
	}
	return w.ResponseWriter.Write(p)
}

func AccessLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		bodyWriter := &AccessLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = bodyWriter

		beginTime := time.Now()
		c.Next()
		tc := time.Since(beginTime)
		ua := user_agent.New(c.Request.UserAgent())
		browserName, browserVersion := ua.Browser()
		global.Logger.Debug(fmt.Sprintf("%s: method: %s, status code: %d, browser: %sV%s, spend %s", c.Request.URL, c.Request.Method, bodyWriter.Status(), browserName, browserVersion, tc))
	}
}
