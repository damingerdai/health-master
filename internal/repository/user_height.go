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
