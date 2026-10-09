package errcode

import (
	"fmt"
	"net/http"
)

type Error struct {
	code    int      `json:"code"`
	message string   `json:"message"`
	details []string `json:"details"`
}

var codes = map[int]string{}

func NewError(code int, message string) *Error {
	if _, ok := codes[code]; ok {
		panic(fmt.Sprintf("error code %d already exists, please use another one", code))
	}
	codes[code] = message

	return &Error{code: code, message: message}
}

func (e *Error) Code() int {
	return e.code
}

func (e *Error) Message() string {
	return e.message
}

func (e *Error) Details() []string {
	return e.details
}

func (e *Error) Error() string {
	return fmt.Sprintf("error code: %d, message: %s", e.code, e.message)
}

func (e *Error) StatusCode() int {
	switch e.Code() {
	case InvalidVerificationCode.Code(), InvalidParams.Code():
		return http.StatusBadRequest
	case ErrLegacyPasswordResetRequired.Code(), ErrInvalidCredentials.Code(),
		UnauthorizedAuthNotExist.Code(), UnauthorizedTokenError.Code(),
		UnauthorizedTokenGenerate.Code(), UnauthorizedTokenTimeout.Code():
		return http.StatusUnauthorized
	case TooManyRequests.Code():
		return http.StatusTooManyRequests
	case NotFound.Code():
		return http.StatusNotFound
	case Success.Code():
		return http.StatusOK
	}

	return http.StatusInternalServerError
}

func (e *Error) WithDetails(details ...string) *Error {
	newErr := *e
	newErr.details = details
	return &newErr
}
