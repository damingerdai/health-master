package repository

import (
	"context"
	"time"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/jackc/pgx/v5"
)

type WeightRecordRepository struct {
	db db.Connection
}

func NewWeigthRecordRepository(db db.Connection) *WeightRecordRepository {
	return &WeightRecordRepository{db: db}
}

func (repos *WeightRecordRepository) Create(ctx context.Context, weightRecord *model.WeightRecord) (*string, error) {
	var id string
	statement := "INSERT INTO weight_records (user_id, weight, record_date, created_at, updated_at) VALUES ($1, $2, $3, now(), now()) RETURNING id"
	row := repos.db.QueryRow(ctx, statement, weightRecord.UserId, weightRecord.Weight, weightRecord.RecordDate)
	err := row.Scan(&id)
	if err != nil {
		return nil, err
	}

	return &id, nil
}

func (repos *WeightRecordRepository) Find(ctx context.Context, id string) (*model.WeightRecord, error) {
	var weightRecord model.WeightRecord
	statement := "SELECT id, user_id, weight, record_date WHERE id = $1 AND deleted_at IS NULL LIMIT 1"
	row := repos.db.QueryRow(ctx, statement, id)
	err := row.Scan(&weightRecord.Id, &weightRecord.UserId, &weightRecord.Weight, &weightRecord.RecordDate)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &weightRecord, nil
}

func (repos *WeightRecordRepository) ListByUserId(ctx context.Context, userId string) (*[]model.WeightRecord, error) {
	weightRecords := make([]model.WeightRecord, 0)
	statement := "SELECT id, user_id, weight, record_date WHERE user_id = $1 AND deleted_at IS NULL"
	rows, err := repos.db.Query(ctx, statement, userId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id, userId string
		var weight float64
		var recordDate time.Time
		err := rows.Scan(&id, &userId, &weight, &recordDate)
		if err != nil {
			return nil, err
		}
		weightRecord := model.WeightRecord{
			Id:         id,
			UserId:     userId,
			Weight:     weight,
			RecordDate: recordDate,
		}
		weightRecords = append(weightRecords, weightRecord)
	}
	return &weightRecords, nil
}
