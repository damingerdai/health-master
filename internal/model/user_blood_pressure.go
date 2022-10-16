package model

import "time"

type UserBloodPressure struct {
	Id                     string     `json:"id"`
	UserId                 string     `json:"userId"`
	DiastolicBloodPressure int32      `json:"diastolicBloodPressure"`
	SystolicBloodPressure  int32      `json:"systolicBloodPressure"`
	Pulse                  int32      `json:"pulse"`
	CreatedAt              *time.Time `json:"createdAt,omitempty"`
	UpdatedAt              *time.Time `json:"updatedAt,omitempty"`
	DeletedAt              *time.Time `json:"deletedAt,omitempty"`
}

func (UserBloodPressure) TableName() string {
	return "user_blood_pressure"
}
