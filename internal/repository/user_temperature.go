package repository

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
)

type UserTemperatureRepository struct {
	db db.Connection
}

func NewUserTemperatureRepository(db db.Connection) *UserTemperatureRepository {
	return &UserTemperatureRepository{db}
}

func (userTemperatureRepository *UserTemperatureRepository) Create(ctx context.Context, userTemperature *model.UserTemperature) error {
	statement := "INSERT INTO users_temperatures (user_id, temperature, unit, notes, record_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, created_at, updated_at"
	row := userTemperatureRepository.db.QueryRow(ctx, statement, userTemperature.UserId, userTemperature.Temperature, userTemperature.Unit, userTemperature.Notes, userTemperature.RecordDate)
	var id string
	var createDt, updateDt time.Time
	err := row.Scan(&id, &createDt, &updateDt)
	if err != nil {
		return err
	}
	userTemperature.ID = id
	userTemperature.CreatedAt = &createDt
	userTemperature.UpdatedAt = &updateDt

	return nil
}

func (userTemperatureRepository *UserTemperatureRepository) Find(ctx context.Context, id string) (*model.UserTemperature, error) {
	statement := `
		SELECT 
			ut.id, ut.temperature, ut.unit, ut.notes, ut.record_date,
			ut.created_at, ut.updated_at,
			ut.user_id, u.username, u.first_name, u.last_name, u.gender
		FROM users_temperatures ut
		LEFT JOIN users u on u.id = ut.user_id
		WHERE ut.id = $1 AND ut.deleted_at IS NULL
	`
	row := userTemperatureRepository.db.QueryRow(ctx, statement, id)
	var rid, userId, username, fristName, lastName, gender string
	var createdAt, updatedAt, recordDate *time.Time
	var temperature float64
	var unit string
	var notes *string

	err := row.Scan(&rid, &temperature, &unit, &notes, &recordDate, &createdAt, &updatedAt, &userId, &username, &fristName, &lastName, &gender)
	if err != nil {
		return nil, err
	}
	userTemperature := model.UserTemperature{
		UserTemperatureRecord: model.UserTemperatureRecord{
			ID:          rid,
			UserId:      userId,
			Temperature: temperature,
			Unit:        unit,
			Notes:       notes,
			RecordDate:  *recordDate,
			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
		},

		User: &model.User{
			Id:        userId,
			Username:  username,
			FirstName: fristName,
			LastName:  lastName,
			Gender:    gender,
		},
	}
	return &userTemperature, nil
}

func (userTemperatureRepository *UserTemperatureRepository) List(ctx context.Context, userId string) (*[]model.UserTemperature, error) {
	var uts []model.UserTemperature
	statement := `
		SELECT 
			ut.id, ut.temperature, ut.unit, ut.notes, ut.record_date,
			ut.created_at, ut.updated_at,
			ut.user_id, u.username, u.first_name, u.last_name, u.gender
		FROM users_temperatures ut
		LEFT JOIN users u on u.id = ut.user_id
		WHERE ut.deleted_at IS NULL AND ut.user_id = $1
		ORDER BY ut.record_date DESC
	`
	rows, err := userTemperatureRepository.db.Query(ctx, statement, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var rid, uid, username, fristName, lastName string
		var createdAt, updatedAt, recordDate *time.Time
		var temperature float64
		var unit string
		var notes *string
		var gender string
		err := rows.Scan(&rid, &temperature, &unit, &notes, &recordDate, &createdAt, &updatedAt, &uid, &username, &fristName, &lastName, &gender)
		if err != nil {
			return nil, err
		}
		userTemperature := model.UserTemperature{
			UserTemperatureRecord: model.UserTemperatureRecord{
				ID:          rid,
				UserId:      uid,
				Temperature: temperature,
				Unit:        unit,
				Notes:       notes,
				RecordDate:  *recordDate,
				CreatedAt:   createdAt,
				UpdatedAt:   updatedAt,
			},

			User: &model.User{
				Id:        uid,
				Username:  username,
				FirstName: fristName,
				LastName:  lastName,
				Gender:    gender,
			},
		}
		uts = append(uts, userTemperature)
	}
	return &uts, nil
}
