package model

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type UserToken struct {
	AccessToken string    `json:"accessToken"`
	Expired     time.Time `json:"expired"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
