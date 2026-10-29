package routers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	_ "github.com/damingerdai/health-master/docs"
	"github.com/gin-gonic/gin"
)

func TestSwaggerHandler(t *testing.T) {
	router := gin.New()
	router.GET("/swagger/*any", swaggerHandler())

	for _, tc := range []struct {
		path        string
		status      int
		contentType string
		body        string
	}{
		{"/swagger/", http.StatusOK, "text/html", "swagger-ui-bundle.js"},
		{"/swagger/index.html", http.StatusMovedPermanently, "", ""},
		{"/swagger/swagger-initializer.js", http.StatusOK, "application/javascript", `url: "./doc.json"`},
		{"/swagger/swagger-ui.css", http.StatusOK, "text/css", ".swagger-ui"},
		{"/swagger/swagger-ui-bundle.js", http.StatusOK, "javascript", "SwaggerUIBundle"},
		{"/swagger/doc.json", http.StatusOK, "application/json", `"swagger": "2.0"`},
		{"/swagger/missing.js", http.StatusNotFound, "", ""},
	} {
		t.Run(tc.path, func(t *testing.T) {
			response := httptest.NewRecorder()
			router.ServeHTTP(response, httptest.NewRequest(http.MethodGet, tc.path, nil))
			if response.Code != tc.status {
				t.Fatalf("status = %d, want %d", response.Code, tc.status)
			}
			if !strings.Contains(response.Header().Get("Content-Type"), tc.contentType) {
				t.Errorf("unexpected content type: %s", response.Header().Get("Content-Type"))
			}
			if !strings.Contains(response.Body.String(), tc.body) {
				t.Errorf("response does not contain %q", tc.body)
			}
		})
	}
}
