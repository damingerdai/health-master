package model

import (
	"time"
)

type WeightRecord struct {
	Id         string     `json:"id,omitempty"`
	UserId     string     `json:"userId"`
	Weight     float64    `json:"weight" binding:"required,gt=0,lte=500"`
	RecordDate time.Time  `json:"recordDate" time_format:"2006-01-02 15:04:05" time_location:"Asia/Shanghai"`
	CreatedAt  *time.Time `json:"createdAt,omitempty"`
	UpdatedAt  *time.Time `json:"updatedAt,omitempty"`
	DeletedAt  *time.Time `json:"deletedAt,omitempty"`
}

type WeightRecordVO struct {
	User *User `json:"user"`
	WeightRecord
}

type WeightGoal struct {
	Id           string
	UserId       string
	TargetWeight float64
	CreatedAt    *time.Time
	UpdatedAt    *time.Time
	DeletedAt    *time.Time
}
