package global

import "github.com/jackc/pgx/v5/pgxpool"

var (
	DBEngine *pgxpool.Pool
)
