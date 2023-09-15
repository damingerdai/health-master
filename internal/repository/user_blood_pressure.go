package repository

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
)

type UserBloodPressureRepository struct {
	db db.Connection
}

func NewUserBloodPressureRepository(db db.Connection) *UserBloodPressureRepository {
	return &UserBloodPressureRepository{db}
}

func (userBloodPressureRepository *UserBloodPressureRepository) Create(ctx context.Context, userBloodPressure *model.UserBloodPressure) error {
	statement := "INSERT INTO user_blood_pressure (user_id, diastolic_blood_pressure, systolic_blood_pressure, pulse, created_at, updated_at, log_datetime ) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5) RETURNING id, created_at, updated_at"
	row := userBloodPressureRepository.db.QueryRow(ctx, statement, userBloodPressure.UserId, userBloodPressure.DiastolicBloodPressure, userBloodPressure.SystolicBloodPressure, userBloodPressure.Pulse, userBloodPressure.LogDatetime)
	var id string
	var createDt, updateDt time.Time
	err := row.Scan(&id, &createDt, &updateDt)
	if err != nil {
		return err
	}
	userBloodPressure.Id = id
	userBloodPressure.CreatedAt = &createDt
	userBloodPressure.UpdatedAt = &updateDt

	return nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) Find(ctx context.Context, id string) (*model.UserBloodPressure, error) {
	statement := `
		SELECT 
			ubp.id, ubp.diastolic_blood_pressure, ubp.systolic_blood_pressure, ubp.pulse, 
			ubp.created_at, ubp.updated_at, ubp.log_datetime,
			ubp.user_id, u.username, u.first_name, u.last_name, u.gender
		FROM user_blood_pressure ubp
		LEFT JOIN users u on u.id = ubp.user_id
		WHERE ubp.id = $1 AND ubp.deleted_at IS NULL
	`
	row := userBloodPressureRepository.db.QueryRow(ctx, statement, id)
	var rid, userId, username, fristName, lastName, gender string
	var createdAt, updatedAt, logDatetime *time.Time
	var diastolicBloodPressure, systolicBloodPressure, pulse int32
	err := row.Scan(&rid, &diastolicBloodPressure, &systolicBloodPressure, &pulse, &createdAt, &updatedAt, &logDatetime, &userId, &username, &fristName, &lastName, &gender)
	if err != nil {
		return nil, err
	}
	userBloodPressure := model.UserBloodPressure{
		Id:                     rid,
		DiastolicBloodPressure: diastolicBloodPressure,
		SystolicBloodPressure:  systolicBloodPressure,
		Pulse:                  pulse,
		UserId:                 userId,
		User: &model.User{
			Id: userId,
		},

		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
		LogDatetime: logDatetime,
	}
	return &userBloodPressure, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) List(ctx context.Context) (*[]model.UserBloodPressure, error) {
	var ubps []model.UserBloodPressure
	statement := `
		SELECT 
			ubp.id, ubp.diastolic_blood_pressure, ubp.systolic_blood_pressure, ubp.pulse, 
			ubp.created_at, ubp.updated_at, ubp.log_datetime,
			ubp.user_id, u.username, u.first_name, u.last_name, u.gender
		FROM user_blood_pressure ubp
		LEFT JOIN users u on u.id = ubp.user_id
		WHERE ubp.deleted_at IS NULL
	`
	rows, err := userBloodPressureRepository.db.Query(ctx, statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var rid, userId, username, fristName, lastName, gender string
		var createdAt, updatedAt, logDatetime *time.Time
		var diastolicBloodPressure, systolicBloodPressure, pulse int32
		err := rows.Scan(&rid, &diastolicBloodPressure, &systolicBloodPressure, &pulse, &createdAt, &updatedAt, &logDatetime, &userId, &username, &fristName, &lastName, &gender)
		if err != nil {
			return nil, err
		}
		userBloodPressure := model.UserBloodPressure{
			Id:                     rid,
			DiastolicBloodPressure: diastolicBloodPressure,
			SystolicBloodPressure:  systolicBloodPressure,
			Pulse:                  pulse,
			UserId:                 userId,
			User: &model.User{
				Id:        userId,
				Username:  username,
				FirstName: fristName,
				LastName:  lastName,
				Gender:    gender,
			},

			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
			LogDatetime: logDatetime,
		}
		ubps = append(ubps, userBloodPressure)
	}
	return &ubps, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) ListByUserId(ctx context.Context, userId string, page, limit int) (*[]model.UserBloodPressure, error) {
	var ubps []model.UserBloodPressure
	statement := `
		SELECT 
			ubp.id, ubp.diastolic_blood_pressure, ubp.systolic_blood_pressure, ubp.pulse, 
			ubp.created_at, ubp.updated_at, ubp.log_datetime,
			ubp.user_id, u.username, u.first_name, u.last_name, u.gender
		FROM user_blood_pressure ubp
		LEFT JOIN users u on u.id = ubp.user_id
		WHERE ubp.user_id = $1 AND ubp.deleted_at IS NULL
		ORDER BY ubp.log_datetime DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := userBloodPressureRepository.db.Query(ctx, statement, userId, limit, limit*(page-1))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var rid, userId, username, fristName, lastName, gender string
		var createdAt, updatedAt, logDatetime *time.Time
		var diastolicBloodPressure, systolicBloodPressure, pulse int32
		err := rows.Scan(&rid, &diastolicBloodPressure, &systolicBloodPressure, &pulse, &createdAt, &updatedAt, &logDatetime, &userId, &username, &fristName, &lastName, &gender)
		if err != nil {
			return nil, err
		}
		userBloodPressure := model.UserBloodPressure{
			Id:                     rid,
			DiastolicBloodPressure: diastolicBloodPressure,
			SystolicBloodPressure:  systolicBloodPressure,
			Pulse:                  pulse,
			UserId:                 userId,
			User: &model.User{
				Id:        userId,
				Username:  username,
				FirstName: fristName,
				LastName:  lastName,
				Gender:    gender,
			},

			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
			LogDatetime: logDatetime,
		}
		ubps = append(ubps, userBloodPressure)
	}
	return &ubps, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) Count(ctx context.Context, userId string) (int64, error) {
	var num int64
	statement := "SELECT count(*) FROM user_blood_pressure ubp WHERE ubp.user_id = $1 AND ubp.deleted_at IS NULL"
	err := userBloodPressureRepository.db.QueryRow(ctx, statement, userId).Scan(&num)
	if err != nil {
		return num, err
	}

	return num, nil
}

func (userBloodPressureRepository *UserBloodPressureRepository) Delete(ctx context.Context, id string) error {
	statement := "UPDATE user_blood_pressure SET deleted_at = now() WHERE id = $1"
	_, err := userBloodPressureRepository.db.Exec(ctx, statement, id)
	if err != nil {
		return err
	}
	return nil
}
