package repository

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/global"
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
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
	statement := "SELECT id, username, first_name, last_name, password, gender FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, id)
	err := row.Scan(&user.Id, &user.Username, &user.FirstName, &user.LastName, &user.Password, &user.Gender)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (userRepository *UserRepository) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	statement := "SELECT id, username, first_name, last_name, password, gender FROM users WHERE username = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, username)
	var id, rusername, firstname, lastname, password, gender string
	err := row.Scan(&id, &rusername, &firstname, &lastname, &password, &gender)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		global.Logger.Error("fail to find user", zap.String("username", username), zap.Error(err))
		global.Logger.Sync()
		return nil, err
	}
	user := model.User{
		Id:        id,
		Username:  rusername,
		FirstName: firstname,
		LastName:  lastname,
		Password:  password,
		Gender:    gender,
	}
	return &user, nil
}
