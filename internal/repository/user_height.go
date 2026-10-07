package repository

import (
	"context"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
)

type UserHeightRepository struct {
	db db.Connection
}

func NewUserHeightRepository(db db.Connection) *UserHeightRepository {
	return &UserHeightRepository{db: db}
}

func (repos *UserHeightRepository) Create(ctx context.Context, height *model.UserHeight) error {
	statement := `
     INSERT INTO user_heights (user_id, height, record_date) VALUES ($1, $2, $3) RETURNING ID
  `
	var id string
	row := repos.db.QueryRow(ctx, statement, height.UserId, height.Height, height.RecordDate)
	err := row.Scan(&id)
	if err != nil {
		return err
	}
	height.Id = id

	return nil
}

func (repos *UserHeightRepository) List(ctx context.Context, userId string) ([]*model.UserHeightVO, error) {
	statement := `
		SELECT id, user_id, height, record_date
		FROM user_heights
		WHERE user_id = $1
		ORDER BY record_date DESC
	`
	rows, err := repos.db.Query(ctx, statement, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []*model.UserHeightVO
	for rows.Next() {
		var h model.UserHeight
		err := rows.Scan(&h.Id, &h.UserId, &h.Height, &h.RecordDate)
		if err != nil {
			return nil, err
		}
		res = append(res, &model.UserHeightVO{UserHeight: h})
	}

	return res, nil
}

func (repos *UserHeightRepository) PagingQueryByUserId(ctx context.Context, userId string, page, limit int) ([]*model.UserHeight, error) {
	statement := `
		SELECT id, user_id, height, record_date
		FROM user_heights
		WHERE user_id = $1
		ORDER BY record_date DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := repos.db.Query(ctx, statement, userId, limit, limit*(page-1))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []*model.UserHeight
	for rows.Next() {
		var h model.UserHeight
		err := rows.Scan(&h.Id, &h.UserId, &h.Height, &h.RecordDate)
		if err != nil {
			return nil, err
		}
		res = append(res, &h)
	}

	return res, nil
}

func (repos *UserHeightRepository) Count(ctx context.Context, userId string) (int64, error) {
	var num int64
	statement := "SELECT COUNT(id) FROM user_heights WHERE user_id = $1 AND deleted_at IS NULL"
	row := repos.db.QueryRow(ctx, statement, userId)
	err := row.Scan(&num)
	if err != nil {
		return 0, err
	}
	return num, nil
}
