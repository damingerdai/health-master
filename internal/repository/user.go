package repository

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
)

type UserRepository struct {
	db db.Connection
}

func NewUserRepository(db db.Connection) *UserRepository {
	return &UserRepository{db}
}

func (userRepository *UserRepository) Create(ctx context.Context, user *model.User) error {
	statement := `
		INSERT INTO users (username, first_name, last_name, password, gender, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, created_at, updated_at
	`
	var id string
	var createdAt, updatedAt *time.Time
	row := userRepository.db.QueryRow(ctx, statement, user.Username, user.FirstName, user.LastName, user.Password, user.Gender)
	err := row.Scan(&id, &createdAt, &updatedAt)
	if err != nil {
		return nil
	}
	user.Id = id
	user.CreatedAt = createdAt
	user.UpdatedAt = updatedAt

	return nil
}

func (userRepository *UserRepository) Find(ctx context.Context, id string) (*model.User, error) {
	var user model.User
	statement := "SELECT id,u sername, first_name, last_name, password, gender FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, id)
	err := row.Scan(&user.Id, &user.Username, &user.FirstName, &user.LastName, &user.Password, &user.Gender)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (userRepository *UserRepository) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	var user model.User
	statement := "SELECT id,u sername, first_name, last_name, password, gender FROM users WHERE username = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, username)
	err := row.Scan(&user.Id, &user.Username, &user.FirstName, &user.LastName, &user.Password, &user.Gender)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
