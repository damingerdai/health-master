package response

import (
	"fmt"
	"net/http"

	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/gin-gonic/gin"
)

type Response struct {
	Ctx *gin.Context
}

func NewResponse(ctx *gin.Context) *Response {
	return &Response{
		Ctx: ctx,
	}
}

func (r *Response) ToResponse(data any) {
	if data == nil {
		code := errcode.Success
		r.Ctx.JSON(http.StatusOK, gin.H{"code": code.Code(), "message": code.Message()})
		return
	}
	r.Ctx.JSON(http.StatusOK, gin.H{"code": 200, "data": data})
}

func (r *Response) ToTokenResponse(data any) {
	if data == nil {
		code := errcode.Success
		r.Ctx.JSON(http.StatusOK, gin.H{"code": code.Code(), "message": code.Message()})
		return
	}
	r.Ctx.JSON(http.StatusOK, gin.H{"code": 200, "token": data})
}

func (r *Response) ToErrorResponse(err *errcode.Error) {
	response := gin.H{"code": err.Code(), "message": err.Message()}
	details := err.Details()
	if len(details) > 0 {
		response["details"] = details
	}

	r.Ctx.JSON(err.StatusCode(), response)
}

func (r *Response) ToErrorResponseWithError(err *errcode.Error, cause error) {
	message := err.Message()
	fmt.Println(cause.Error() != "")
	if cause.Error() != "" {
		message = cause.Error()
	}
	response := gin.H{"code": err.Code(), "message": message}
	details := err.Details()
	if len(details) > 0 {
		response["details"] = details
	}

	r.Ctx.JSON(err.StatusCode(), response)
}
