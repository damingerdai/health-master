package model

import "time"

type User struct {
	Id        string     `json:"id"`
	FirstName string     `json:"firstName"`
	LastName  string     `json:"lastName"`
	Password  string     `json:"password"`
	Gender    string     `json:"gender"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

func (User) TableName() string {
	return "users"
}
