package model

type Role struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (Role) TableName() string {
	return "roles"
}
