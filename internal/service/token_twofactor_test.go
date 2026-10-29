package service

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/cryptox"
	"github.com/damingerdai/health-master/pkg/errcode"
	"github.com/damingerdai/health-master/pkg/pwd"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/damingerdai/health-master/pkg/util/tokens"
	"github.com/pquerna/otp/totp"
	"github.com/redis/go-redis/v9"
)

func TestChallengeTokenIsolation(t *testing.T) {
	previous := global.JwtSetting
	global.JwtSetting = &setting.JwtSettingS{Secret: "test-secret", Issuer: "test"}
	t.Cleanup(func() { global.JwtSetting = previous })
	svc := &TokenService{}
	challenge, err := svc.CreateChallengeToken(context.Background(), &model.User{Id: "user"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := svc.ParseToken(challenge.AccessToken); err == nil {
		t.Fatal("challenge accepted as access token")
	}
	claims, err := svc.ParseChallengeToken(challenge.AccessToken)
	if err != nil || claims.UserId != "user" {
		t.Fatalf("invalid challenge: %v", err)
	}
	access, err := tokens.CreateToken(global.JwtSetting.GetJwtSecret(), "user", "test", time.Now().Add(time.Minute))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := svc.ParseChallengeToken(*access); err == nil {
		t.Fatal("access token accepted as challenge")
	}
	if _, err := svc.ParseToken(*access); err != nil {
		t.Fatal(err)
	}
}

func (r *twoFactorMemoryRepository) FindByEmail(context.Context, string) (*model.User, error) {
	u := r.user
	return &u, nil
}

func TestCreateTokenTwoFactor(t *testing.T) {
	hash, err := pwd.HashPassword("password", nil)
	if err != nil {
		t.Fatal(err)
	}
	aes, err := cryptox.NewAES(strings.Repeat("a", 32))
	if err != nil {
		t.Fatal(err)
	}
	const secret = "JBSWY3DPEHPK3PXP"
	encrypted, err := aes.Encrypt(secret)
	if err != nil {
		t.Fatal(err)
	}
	code, err := totp.GenerateCode(secret, time.Now())
	if err != nil {
		t.Fatal(err)
	}
	previousJWT, previousRedis := global.JwtSetting, global.RedisClient
	global.JwtSetting = &setting.JwtSettingS{Secret: "test-secret", Issuer: "test", Expire: time.Hour}
	// A closed cache exercises token generation without external infrastructure.
	global.RedisClient = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	global.RedisClient.Close()
	t.Cleanup(func() { global.JwtSetting, global.RedisClient = previousJWT, previousRedis })

	for _, tc := range []struct {
		name           string
		enabled        bool
		password, code string
		unconfigured   bool
		wantErr        error
	}{
		{name: "no 2fa", password: "password"},
		{name: "missing code", enabled: true, password: "password", wantErr: errcode.ErrTwoFactorAuthenticationRequired},
		{name: "invalid code", enabled: true, password: "password", code: "bad", wantErr: errcode.InvalidVerificationCode},
		{name: "valid code", enabled: true, password: "password", code: code},
		{name: "wrong password", enabled: true, password: "wrong", code: code, wantErr: errcode.ErrInvalidCredentials},
		{name: "unconfigured verifier", enabled: true, password: "password", code: code, unconfigured: true, wantErr: errcode.ServerError},
	} {
		t.Run(tc.name, func(t *testing.T) {
			repo := &twoFactorMemoryRepository{user: model.User{Id: "user", Password: hash, TwoFactorEnabled: tc.enabled, TwoFactorSecret: &encrypted}}
			svc := &TokenService{userRepository: repo}
			if !tc.unconfigured {
				svc.twoFactorService = &TwoFactorService{Aes: aes, UserRepository: repo}
			}
			token, err := svc.CreateToken(context.Background(), "test@example.com", tc.password, tc.code)
			if !errors.Is(err, tc.wantErr) {
				t.Fatalf("error = %v, want %v", err, tc.wantErr)
			}
			if tc.wantErr != nil {
				if token != nil {
					t.Fatal("issued token before authentication completed")
				}
				return
			}
			if token == nil {
				t.Fatal("missing access token")
			}
			claims, err := svc.ParseToken(token.AccessToken)
			if err != nil || claims.UserId != "user" {
				t.Fatalf("invalid access token: %v", err)
			}
		})
	}
}
