package service

import "errors"

// ErrUserNotFound indicates that a service could not find the requested user.
var ErrUserNotFound = errors.New("user not found")
