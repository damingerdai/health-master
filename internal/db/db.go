package db

import (
	"context"
	"time"

	pgxuuid "github.com/jackc/pgx-gofrs-uuid"
	pgxdecimal "github.com/jackc/pgx-shopspring-decimal"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

var (
	ParseConfig   = pgxpool.ParseConfig
	ConnectConfig = pgxpool.NewWithConfig
	Ping          = func(ctx context.Context, pool *pgxpool.Pool) error {
		if _, err := pool.Exec(ctx, "SELECT 1+1 AS result"); err != nil {
			return errors.Wrap(err, "Initial: Unable to connect to db")
		}
		return nil
	}
)

func NewDBPool(ctx context.Context, dbUrl string) (*pgxpool.Pool, error) {
	poolConfig, err := ParseConfig(dbUrl)
	if err != nil {
		return nil, errors.Errorf("Initial: pg config connURL error: %s", err.Error())
	}
	poolConfig.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {
		pgxuuid.Register(conn.TypeMap())
		pgxdecimal.Register(conn.TypeMap())
		return nil
	}

	poolConfig.ConnConfig.Tracer = nil

	poolConfig.MaxConns = 30
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = 1 * time.Hour

	pool, err := ConnectConfig(ctx, poolConfig)
	if err != nil {
		return nil, errors.Errorf("Initial: Unable to connect to database: %s", err.Error())
	}

	if err := Ping(ctx, pool); err != nil {
		return nil, err
	}

	return pool, nil
}
