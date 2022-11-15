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
	UserId string `json:"userId"`
	jwt.StandardClaims
}
