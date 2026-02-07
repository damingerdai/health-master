package model

import (
	"time"

	"github.com/google/uuid"
)

type TokenRecord struct {
	ID         uuid.UUID              `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID     uuid.UUID              `json:"userId" gorm:"type:uuid;index"`
	TokenHash  string                 `json:"tokenHash" gorm:"type:text"`
	Category   string                 `json:"category" gorm:"type:varchar(50)"`
	Metadata   map[string]interface{} `json:"metadata,omitempty" gorm:"type:jsonb"`
	StartsAt   time.Time              `json:"startsAt"`
	ExpiresAt  time.Time              `json:"expiresAt"`
	MaxUses    int                    `json:"maxUses"`
	UsedCount  int                    `json:"usedCount"`
	IsRevoked  bool                   `json:"isRevoked"`
	CreatedAt  time.Time              `json:"createdAt"`
	LastUsedAt *time.Time             `json:"lastUsedAt,omitempty"`
}
