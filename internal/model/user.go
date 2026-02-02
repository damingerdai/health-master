package model

import "time"

type User struct {
	Id        string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Username  string     `json:"username" binding:"required"`
	FirstName string     `json:"firstName" binding:"required"`
	LastName  string     `json:"lastName" binding:"required"`
	Email     string     `json:"email,omitempty"`
	Password  string     `json:"password,omitempty" binding:"required"`
	Gender    string     `json:"gender" binding:"required"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

func (User) TableName() string {
	return "users"
}

type FullUser struct {
	User
	Role Role `json:"role,omitempty"`
}
