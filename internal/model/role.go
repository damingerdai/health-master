package model

type Role struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	// CreateAt    *time.Time `json:"create_dt"`
	// CreateUser  string     `json:"create_user"`
	// UpdateAt    *time.Time `json:"update_dt"`
	// UpdateUser  string     `json:"update_user"`
}

func (Role) TableName() string {
	return "roles"
}
