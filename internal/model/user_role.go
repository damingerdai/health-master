package model

import (
	"time"
)

type UserRole struct {
	Id        string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserId    string     `json:"userId"`
	RoleId    string     `json:"roleId"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

func (UserRole) TableName() string {
	return "user_roles"
}
