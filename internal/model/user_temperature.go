package model

import "time"

type UserTemperatureRecord struct {
	ID          string    `json:"id,omitempty" db:"id"`
	UserId      string    `json:"userId" db:"user_id"`
	Temperature float64   `json:"temperature" db:"temperature"`
	Unit        string    `json:"unit,omitempty" db:"unit"` // e.g. "C" or "F"
	Notes       *string   `json:"notes,omitempty" db:"notes"`
	RecordDate  time.Time `json:"recordDate,omitempty" db:"record_date" time_format:"2006-01-02 15:04:000Z"`

	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

type UserTemperature struct {
	UserTemperatureRecord
	User *User `json:"user,omitempty" gorm:"UserId"`
}
