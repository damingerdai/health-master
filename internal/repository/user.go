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
		INSERT INTO users (username, first_name, last_name, email, password, gender, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, created_at, updated_at
	`
	var id string
	var createdAt, updatedAt *time.Time
	row := userRepository.db.QueryRow(ctx, statement, user.Username, user.FirstName, user.LastName, user.Email, user.Password, user.Gender)
	err := row.Scan(&id, &createdAt, &updatedAt)
	if err != nil {
		return err
	}
	user.Id = id
	user.CreatedAt = createdAt
	user.UpdatedAt = updatedAt

	return nil
}

func (userRepository *UserRepository) Find(ctx context.Context, id string) (*model.User, error) {
	var user model.User
	statement := "SELECT id, username, first_name, last_name, email, password, gender, two_factor_enabled, two_factor_secret, two_factor_verified_at FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, id)
	err := row.Scan(&user.Id, &user.Username, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Gender, &user.TwoFactorEnabled, &user.TwoFactorSecret, &user.TwoFactorVerifiedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (userRepository *UserRepository) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	statement := "SELECT id, username, first_name, last_name, email, password, gender, two_factor_enabled, two_factor_secret, two_factor_verified_at FROM users WHERE username = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, username)
	var id, rusername, firstname, lastname, email, password, gender, twoFactorSecret string
	var twoFactorEnabled bool
	var twoFactorVerfifiedAt *time.Time
	err := row.Scan(&id, &rusername, &firstname, &lastname, &email, &password, &gender, &twoFactorEnabled, &twoFactorSecret, &twoFactorVerfifiedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		global.Logger.Error("fail to find user", zap.String("username", username), zap.Error(err))
		// global.Logger.Sync()
		return nil, err
	}
	user := model.User{
		Id:                  id,
		Username:            rusername,
		FirstName:           firstname,
		LastName:            lastname,
		Password:            password,
		Gender:              gender,
		TwoFactorEnabled:    twoFactorEnabled,
		TwoFactorSecret:     &twoFactorSecret,
		TwoFactorVerifiedAt: twoFactorVerfifiedAt,
	}
	return &user, nil
}

func (userRepository *UserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	statement := "SELECT id, username, first_name, last_name, email, password, gender, two_factor_enabled, two_factor_secret, two_factor_verified_at FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1"
	row := userRepository.db.QueryRow(ctx, statement, email)
	var id, username, firstname, lastname, remail, password, gender string
	var twoFactorSecret *string
	var twoFactorEnabled bool
	var twoFactorVerfifiedAt *time.Time
	err := row.Scan(&id, &username, &firstname, &lastname, &remail, &password, &gender, &twoFactorEnabled, &twoFactorSecret, &twoFactorVerfifiedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		global.Logger.Error("fail to find user by email", zap.String("email", email), zap.Error(err))
		return nil, err
	}
	user := model.User{
		Id:                  id,
		Username:            username,
		FirstName:           firstname,
		LastName:            lastname,
		Email:               remail,
		Password:            password,
		Gender:              gender,
		TwoFactorEnabled:    twoFactorEnabled,
		TwoFactorSecret:     twoFactorSecret,
		TwoFactorVerifiedAt: twoFactorVerfifiedAt,
	}
	return &user, nil
}

func (userRepository *UserRepository) UpdatePassword(ctx context.Context, userID string, newPassword string) error {
	statement := "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL"
	_, err := userRepository.db.Exec(ctx, statement, newPassword, userID)
	return err
}

func (userRepository *UserRepository) Update(ctx context.Context, user *model.User) error {
	statement := `
		UPDATE users 
		SET username = $1, first_name = $2, last_name = $3, gender = $4, updated_at = NOW() 
		WHERE id = $5 AND deleted_at IS NULL
	`
	_, err := userRepository.db.Exec(ctx, statement, user.Username, user.FirstName, user.LastName, user.Gender, user.Id)
	return err
}

func (userRepository *UserRepository) Delete(ctx context.Context, id string) error {
	statement := "UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL"
	_, err := userRepository.db.Exec(ctx, statement, id)
	return err
}

func (userRepository *UserRepository) SaveTwoFactorSecret(ctx context.Context, userID string, twoFactorySecert string) error {
	statement := `
		UPDATE users
	  SET two_factor_secret = $1, updated_at = NOW() 
	  WHERE id = $2 AND deleted_at IS NULL
	`
	_, err := userRepository.db.Exec(ctx, statement, twoFactorySecert, userID)
	return err
}

func (userRepository *UserRepository) EnableTwoFactor(ctx context.Context, userID string) error {
	statement := `
		UPDATE users
		SET two_factor_enabled = TRUE, two_factor_verified_at = NOW(), updated_at = NOW()
	  WHERE id = $1 AND deleted_at IS NULL
	`
	_, err := userRepository.db.Exec(ctx, statement, userID)
	return err
}

func (userRepository *UserRepository) DisableTwoFactor(ctx context.Context, userID string) error {
	statement := `
		UPDATE users
		SET two_factor_enabled = FALSE, two_factor_secret = null, two_factor_verified_at = null, updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
	`
	_, err := userRepository.db.Exec(ctx, statement, userID)
	return err
}
