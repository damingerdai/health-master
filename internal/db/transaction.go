package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewTransaction(ctx context.Context, pool *pgxpool.Pool, f func(conn Connection) error) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}

	err = f(tx)
	if err != nil {
		tx.Rollback(ctx)
		return err
	}
	tx.Commit(ctx)
	return nil

}
