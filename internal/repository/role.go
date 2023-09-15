package repository

import (
	"context"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
)

type RoleRepository struct {
	db db.Connection
}

func NewRoleRepository(db db.Connection) *RoleRepository {
	return &RoleRepository{
		db: db,
	}
}

func (roleRepo *RoleRepository) List(ctx context.Context) (*[]model.Role, error) {
	statement := "SELECT id, name, description FROM roles"
	roles := make([]model.Role, 0, 2)
	rows, err := roleRepo.db.Query(ctx, statement)
	if err != nil {
		return &roles, err
	}
	defer rows.Close()
	for rows.Next() {
		var id, name, description string
		rows.Scan(&id, &name, &description)
		role := model.Role{
			Id:          id,
			Name:        name,
			Description: description,
		}
		roles = append(roles, role)
	}

	return &roles, nil
}

func (roleRepo *RoleRepository) FindByName(ctx context.Context, name string) (*model.Role, error) {
	statement := "SELECT id, name, description FROM roles WHERE name = $1 LIMIT 1"
	row := roleRepo.db.QueryRow(ctx, statement, name)
	var id, rname, description string
	err := row.Scan(&id, &rname, &description)
	if err != nil {
		return nil, err
	}
	role := model.Role{
		Id:          id,
		Name:        rname,
		Description: description,
	}
	return &role, nil
}
