package model

import "time"

type UserBloodPressure struct {
	Id                     string     `json:"id"`
	UserId                 string     `json:"userId"`
	DiastolicBloodPressure int32      `json:"diastolicBloodPressure"`
	SystolicBloodPressure  int32      `json:"systolicBloodPressure"`
	Pulse                  int32      `json:"pulse"`
	User                   *User      `json:"user,omitempty" gorm:"UserId"`
	LogDatetime            *time.Time `json:"logDatetime,omitempty" time_format:"2006-01-02 15:04"`
	CreatedAt              *time.Time `json:"createdAt,omitempty"`
	UpdatedAt              *time.Time `json:"updatedAt,omitempty"`
	DeletedAt              *time.Time `json:"deletedAt,omitempty"`
}

func (UserBloodPressure) TableName() string {
	return "user_blood_pressure"
}
