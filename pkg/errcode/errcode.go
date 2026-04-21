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
	case InvalidParams.Code():
		fallthrough
	case InvalidOrExpiredToken.Code():
		fallthrough
	case ConfirmPasswordCannotBeEmpty.Code():
		fallthrough
	case PasswordsDoNotMatch.Code():
		return http.StatusBadRequest
	case UnauthorizedAuthNotExist.Code():
		fallthrough
	case UnauthorizedTokenError.Code():
		fallthrough
	case UnauthorizedTokenGenerate.Code():
		fallthrough
	case UnauthorizedTokenTimeout.Code():
		return http.StatusUnauthorized
	case TooManyRequests.Code():
		return http.StatusTooManyRequests
	case NotFound.Code():
		return http.StatusNotFound
	case PasswordResetEmailSent.Code():
		return http.StatusAccepted
	case Success.Code():
		fallthrough
	case PasswordResetSuccessfully.Code():
		return http.StatusOK
	case ServerError.Code():
		fallthrough
	case FailedToCreatePasswordResetToken.Code():
		fallthrough
	case FailedToResetPassword.Code():
		return http.StatusInternalServerError
	}

	return http.StatusInternalServerError
}

func (e *Error) WithDetails(details ...string) *Error {
	newErr := *e
	newErr.details = details
	return &newErr
}
