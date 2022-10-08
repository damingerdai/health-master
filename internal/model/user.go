package model

import "time"

type User struct {
	Id        string     `json:"id"`
	Username  string     `json:"username" binding:"required"`
	FirstName string     `json:"firstName" binding:"required"`
	LastName  string     `json:"lastName" binding:"required"`
	Password  string     `json:"password,omitempty" binding:"required"`
	Gender    string     `json:"gender" binding:"required"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

func (User) TableName() string {
	return "users"
}
