package tokens

import (
	"github.com/damingerdai/health-master/internal/model"
	"github.com/golang-jwt/jwt/v4"
)

func CreateToken(secret []byte, userId, issuer string, expiresAt int64) (*string, error) {
	claims := model.Claims{
		UserId: userId,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt,
			Issuer:    issuer,
		},
	}
	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString(secret)
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func ParseToken(token string, secret []byte) (*model.Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &model.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil {
		return nil, err
	}

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*model.Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}

	return nil, err

}
