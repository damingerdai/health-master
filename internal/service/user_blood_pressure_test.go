package service

import (
	"context"
	"errors"
	"testing"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/jackc/pgx/v5"
)

type bloodPressureCreateFailureConn struct {
	db.Connection
	err error
}

func (c bloodPressureCreateFailureConn) QueryRow(context.Context, string, ...any) pgx.Row {
	return bloodPressureCreateFailureRow{err: c.err}
}

type bloodPressureCreateFailureRow struct{ err error }

func (r bloodPressureCreateFailureRow) Scan(...any) error { return r.err }

func TestCreateBloodPressurePropagatesDatabaseError(t *testing.T) {
	want := errors.New("insert failed")
	repo := repository.NewUserBloodPressureRepository(bloodPressureCreateFailureConn{err: want})
	srv := NewUserBloodPressureService(repo)
	if err := srv.Create(context.Background(), &model.UserBloodPressure{}); !errors.Is(err, want) {
		t.Fatalf("Create error = %v, want %v", err, want)
	}
}
