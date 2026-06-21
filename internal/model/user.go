package model

import (
	"time"
)

type User struct {
	Id        string `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Username  string `json:"username" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email,omitempty"`
	Password  string `json:"password,omitempty" binding:"required"`
	Gender    string `json:"gender" binding:"required"`

	TwoFactorEnabled    bool       `json:"two_factor_enabled"`
	TwoFactorSecret     *string    `json:"two_factor_secret"`
	TwoFactorVerifiedAt *time.Time `json:"two_factor_verified_at"`

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

type UpdateUserReq struct {
	Id        *string `json:"id,omitempty"`
	Username  *string `json:"username"`
	FirstName *string `json:"firstName"`
	LastName  *string `json:"lastName"`
	Email     *string `json:"email"`
	Gender    *string `json:"gender"`
}

func (req *UpdateUserReq) ToUserModel() *User {
	if req == nil {
		return nil
	}

	user := &User{}
	if req.Id != nil {
		user.Id = *req.Id
	}
	if req.Username != nil {
		user.Username = *req.Username
	}
	if req.FirstName != nil {
		user.FirstName = *req.FirstName
	}
	if req.LastName != nil {
		user.LastName = *req.LastName
	}
	if req.Email != nil {
		user.Email = *req.Email
	}
	if req.Gender != nil {
		user.Gender = *req.Gender
	}

	return user
}

func (req *UpdateUserReq) MergeInfo(user *User) {
	if req == nil || user == nil {
		return
	}

	if req.Id != nil {
		user.Id = *req.Id
	}
	if req.Username != nil {
		user.Username = *req.Username
	}
	if req.FirstName != nil {
		user.FirstName = *req.FirstName
	}
	if req.LastName != nil {
		user.LastName = *req.LastName
	}
	if req.Email != nil {
		user.Email = *req.Email
	}
	if req.Gender != nil {
		user.Gender = *req.Gender
	}
}
