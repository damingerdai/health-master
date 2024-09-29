package model

import "time"

type UserHeight struct {
	Id         string     `json:"id,omitempty"`
	UserId     string     `json:"userId"`
	Height     float64    `json:"height"`
	RecordDate time.Time  `json:"recordDate"`
	CreatedAt  *time.Time `json:"createdAt,omitempty"`
	UpdatedAt  *time.Time `json:"updatedAt,omitempty"`
	DeletedAt  *time.Time `json:"deletedAt,omitempty"`
}

type UserHeights = []UserHeight

type UserHeightVO struct {
	UserHeight
	User *User `json:"user"`
}
