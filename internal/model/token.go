package model

import (
	"encoding/gob"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func init() {
	gob.Register(UserToken{})
}

type UserToken struct {
	AccessToken string    `json:"accessToken"`
	Expired     time.Time `json:"expired"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
