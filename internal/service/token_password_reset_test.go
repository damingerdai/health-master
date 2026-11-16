package service

import (
	"context"
	"errors"
	"testing"

	"github.com/damingerdai/health-master/internal/model"
)

type passwordResetUserRepository struct {
	tokenUserRepository
	err error
}

func (r *passwordResetUserRepository) FindByEmail(context.Context, string) (*model.User, error) {
	return nil, r.err
}

func TestCreatePasswordResetTokenMissingUser(t *testing.T) {
	// A nil token repository ensures a missing user never triggers token storage.
	svc := &TokenService{userRepository: &passwordResetUserRepository{}}
	token, err := svc.CreatePasswordResetToken(context.Background(), "missing@example.com")
	if err != nil || token != "" {
		t.Fatalf("got token %q, error %v; want empty token and no error", token, err)
	}
}

func TestCreatePasswordResetTokenLookupFailure(t *testing.T) {
	want := errors.New("database unavailable")
	svc := &TokenService{userRepository: &passwordResetUserRepository{err: want}}
	token, err := svc.CreatePasswordResetToken(context.Background(), "user@example.com")
	if !errors.Is(err, want) || token != "" {
		t.Fatalf("got token %q, error %v; want empty token and %v", token, err, want)
	}
}
