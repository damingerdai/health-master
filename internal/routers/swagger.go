package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files/v2"
	"github.com/swaggo/swag"
)

// Use the v2 embedded filesystem directly; gin-swagger expects a v1 WebDAV handler.
func swaggerHandler() gin.HandlerFunc {
	assets := http.StripPrefix("/swagger/", http.FileServer(http.FS(swaggerfiles.FS)))
	return func(ctx *gin.Context) {
		switch ctx.Param("any") {
		case "/doc.json":
			doc, err := swag.ReadDoc()
			if err != nil {
				ctx.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			ctx.Data(http.StatusOK, "application/json; charset=utf-8", []byte(doc))
		case "/swagger-initializer.js":
			ctx.Data(http.StatusOK, "application/javascript; charset=utf-8", []byte(swaggerInitializer))
		default:
			assets.ServeHTTP(ctx.Writer, ctx.Request)
		}
	}
}

const swaggerInitializer = `window.onload = function () {
  window.ui = SwaggerUIBundle({
    url: "./doc.json",
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout"
  });
};`
