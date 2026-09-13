package service

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/pkg/cryptox"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
)

type twoFactorMemoryRepository struct {
	user  model.User
	saves int
}

func (r *twoFactorMemoryRepository) Find(context.Context, string) (*model.User, error) {
	u := r.user
	return &u, nil
}
func (r *twoFactorMemoryRepository) SaveTwoFactorSecret(_ context.Context, _ string, secret string) error {
	if !r.user.TwoFactorEnabled && r.user.TwoFactorSecret == nil {
		r.user.TwoFactorSecret = &secret
		r.saves++
	}
	return nil
}
func (r *twoFactorMemoryRepository) EnableTwoFactor(context.Context, string, string) error {
	r.user.TwoFactorEnabled = true
	return nil
}
func (r *twoFactorMemoryRepository) DisableTwoFactor(context.Context, string, string) error {
	r.user.TwoFactorEnabled = false
	r.user.TwoFactorSecret = nil
	return nil
}

func TestTwoFactorEnrollmentLifecycle(t *testing.T) {
	aes, err := cryptox.NewAES(strings.Repeat("a", 32))
	if err != nil {
		t.Fatal(err)
	}
	repo := &twoFactorMemoryRepository{user: model.User{Id: "user", Email: "test@example.com"}}
	svc := &TwoFactorService{Aes: aes, UserRepository: repo}
	ctx := context.Background()
	setup, err := svc.Generate(ctx, "user", repo.user.Email)
	if err != nil {
		t.Fatal(err)
	}
	if setup.Enabled || setup.Secret == "" || !strings.HasPrefix(setup.QRCodeImage, "data:image/png;base64,") {
		t.Fatal("missing enrollment data")
	}
	if *repo.user.TwoFactorSecret == setup.Secret {
		t.Fatal("secret stored unencrypted")
	}
	again, err := svc.Generate(ctx, "user", repo.user.Email)
	if err != nil {
		t.Fatal(err)
	}
	if again.Secret != setup.Secret || repo.saves != 1 {
		t.Fatal("refresh rotated enrollment secret")
	}
	qrKey, err := otp.NewKeyFromURL(setup.QRCode)
	if err != nil {
		t.Fatal(err)
	}
	if qrKey.Secret() != setup.Secret {
		t.Fatal("QR code and manual setup key use different secrets")
	}
	code, err := totp.GenerateCode(qrKey.Secret(), time.Now())
	if err != nil {
		t.Fatal(err)
	}
	if err := svc.VerifyCode(ctx, "user", code); err == nil {
		t.Fatal("pending enrollment accepted for login")
	}
	if err := svc.Enable(ctx, "user", "bad"); !errors.Is(err, ErrInvalidTwoFactorCode) {
		t.Fatalf("invalid code: %v", err)
	}
	if repo.user.TwoFactorEnabled {
		t.Fatal("invalid code enabled 2fa")
	}
	if err := svc.Enable(ctx, "user", code); err != nil {
		t.Fatal(err)
	}
	enabled, err := svc.Generate(ctx, "user", repo.user.Email)
	if err != nil {
		t.Fatal(err)
	}
	if !enabled.Enabled || enabled.Secret != "" || enabled.QRCode != "" || enabled.QRCodeImage != "" || repo.saves != 1 {
		t.Fatal("enabled setup exposed or rotated secret")
	}
	if err := svc.VerifyCode(ctx, "user", code); err != nil {
		t.Fatal(err)
	}
	if err := svc.Disable(ctx, "user", "bad"); !errors.Is(err, ErrInvalidTwoFactorCode) {
		t.Fatalf("invalid disable: %v", err)
	}
	if !repo.user.TwoFactorEnabled {
		t.Fatal("invalid code disabled 2fa")
	}
	if err := svc.Disable(ctx, "user", code); err != nil {
		t.Fatal(err)
	}
	if repo.user.TwoFactorEnabled || repo.user.TwoFactorSecret != nil {
		t.Fatal("disable retained secret")
	}
	next, err := svc.Generate(ctx, "user", repo.user.Email)
	if err != nil {
		t.Fatal(err)
	}
	if next.Secret == setup.Secret {
		t.Fatal("reenrollment reused disabled secret")
	}
}
