package repository

import (
	"context"

	"github.com/damingerdai/health-master/internal/db"
)

type UserRoleRepository struct {
	db db.Connection
}

func NewUserRoleRepository(db db.Connection) *UserRoleRepository {
	return &UserRoleRepository{db: db}
}

func (userRoleRepository *UserRoleRepository) Create(ctx context.Context, userId, roleId string) (*string, error) {
	var id string
	statement := "INSERT INTO user_roles (user_id, role_id, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING id"
	row := userRoleRepository.db.QueryRow(ctx, statement, userId, roleId)
	err := row.Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}
