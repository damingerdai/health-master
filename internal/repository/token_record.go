package repository

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"

	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/model"
	"github.com/jackc/pgx/v5"
)

type TokenRecordRepository struct {
	db db.Connection
}

func NewTokenRecordRepository(db db.Connection) *TokenRecordRepository {
	return &TokenRecordRepository{db}
}

func (tokenRecordRepo *TokenRecordRepository) HashToken(rawToken string) string {
	h := sha256.New()
	h.Write([]byte(rawToken))
	return hex.EncodeToString(h.Sum(nil))
}

func (tokenRecordRepo *TokenRecordRepository) GetUserByValidToken(ctx context.Context, tokenHash string, category string) (userID string, email string, err error) {
	query := `
		SELECT 
			u.id, 
			CASE 
				WHEN POSITION('@' IN u.email) > 3 THEN 
					OVERLAY(u.email PLACING '***' FROM 3 FOR POSITION('@' IN u.email) - 3)
				ELSE 
					OVERLAY(u.email PLACING '***' FROM 2 FOR POSITION('@' IN u.email) - 2)
			END AS email
		FROM tokens t
		JOIN users u ON t.user_id = u.id
		WHERE t.token_hash = $1 AND t.category = $2
		AND t.is_revoked = FALSE AND t.expires_at > NOW() AND t.used_count < t.max_uses
	`
	err = tokenRecordRepo.db.QueryRow(ctx, query, tokenHash, category).Scan(&userID, &email)
	if err != nil {
		return userID, email, err
	}
	// email = util.MaskEmail(email)
	return userID, email, nil
}

func (r *TokenRecordRepository) CreatePasswordResetToken(ctx context.Context, userID string, rawToken string, metadata map[string]any) error {
	const query = `
		INSERT INTO tokens (user_id, token_hash, category, metadata, starts_at, expires_at, max_uses)
		VALUES ($1, $2, 'password_reset', $3, NOW(), NOW() + interval '15 minutes', 1)
	`
	tokenHash := r.HashToken(rawToken)
	_, err := r.db.Exec(ctx, query, userID, tokenHash, metadata)
	return err
}

func (r *TokenRecordRepository) ConsumeToken(ctx context.Context, rawToken string, category string) (*model.TokenRecord, error) {
	const query = `
		UPDATE tokens
		SET used_count = used_count + 1,
		    last_used_at = NOW()
		WHERE token_hash = $1 
		  AND category = $2
		  AND is_revoked = FALSE
		  AND starts_at <= NOW()
		  AND expires_at > NOW()
		  AND (max_uses = -1 OR used_count < max_uses)
		RETURNING id, user_id, category, metadata, used_count, max_uses, expires_at
	`

	tokenHash := r.HashToken(rawToken)
	var rec model.TokenRecord

	err := r.db.QueryRow(ctx, query, tokenHash, category).Scan(
		&rec.ID,
		&rec.UserID,
		&rec.Category,
		&rec.Metadata,
		&rec.UsedCount,
		&rec.MaxUses,
		&rec.ExpiresAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("token invalid, expired, or already used")
		}
		return nil, err
	}

	return &rec, nil
}
