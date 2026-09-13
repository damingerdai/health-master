package service

import (
	"context"
	"testing"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/setting"
	"github.com/damingerdai/health-master/pkg/util/tokens"
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
