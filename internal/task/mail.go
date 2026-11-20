package task

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/damingerdai/health-master/global"
	"github.com/hibiken/asynq"
	"go.uber.org/zap"
)

const (
	TypeSendMail                   = "mail:send"
	TypeSendResetPasswordTokenMail = "mail:send_reset_password_token"
)

type SendMailPayload struct {
	From    string `json:"from"`
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type SendResetTokenPasswordPayload struct {
	ToEmail string `json:"to_email"`
	Env     string `json:"env"`
	Link    string `json:"link"`
}

func NewSendMailTask(payload SendMailPayload) (*asynq.Task, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSendMail, data), nil
}

func NewSendResetTokenPasswordMailTask(payload SendResetTokenPasswordPayload) (*asynq.Task, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSendResetPasswordTokenMail, data), nil
}

type MailSender interface {
	SendMail(ctx context.Context, to, subject, body string) error
	SendResetPassword(ctx context.Context, toEmail, env, link string) error
}

func HandleSendMail(sender MailSender) asynq.HandlerFunc {
	return func(ctx context.Context, t *asynq.Task) error {
		logger := mailTaskLogger(ctx, t)
		logger.Info("Processing mail task")
		var payload SendMailPayload

		if err := json.Unmarshal(t.Payload(), &payload); err != nil {
			logger.Error("Invalid mail task payload; skipping retries", zap.Error(err))
			return fmt.Errorf("invalid payload: %v: %w", err, asynq.SkipRetry)
		}

		logger = logger.With(zap.String("email", payload.To))
		err := sender.SendMail(
			ctx,
			payload.To,
			payload.Subject,
			payload.Body,
		)
		if err != nil {
			logger.Error("Failed to send email", zap.Error(err))
			return err
		}
		logger.Info("Email sent successfully")
		return nil
	}
}

func HandleSendResetPasswordTokenMail(sender MailSender) asynq.HandlerFunc {
	return func(ctx context.Context, t *asynq.Task) error {
		logger := mailTaskLogger(ctx, t)
		logger.Info("Processing password reset email task")
		var payload SendResetTokenPasswordPayload
		if err := json.Unmarshal(t.Payload(), &payload); err != nil {
			logger.Error("Invalid password reset email task payload; skipping retries", zap.Error(err))
			return fmt.Errorf("invalid payload: %v: %w", err, asynq.SkipRetry)
		}
		logger = logger.With(zap.String("email", payload.ToEmail))
		if err := sender.SendResetPassword(ctx, payload.ToEmail, payload.Env, payload.Link); err != nil {
			logger.Error("Failed to send password reset email", zap.Error(err))
			return err
		}
		logger.Info("Password reset email sent successfully")
		return nil
	}
}

func mailTaskLogger(ctx context.Context, t *asynq.Task) *zap.Logger {
	logger := global.Logger
	if logger == nil {
		logger = zap.NewNop()
	}
	taskID, _ := asynq.GetTaskID(ctx)
	retryCount, _ := asynq.GetRetryCount(ctx)
	return logger.With(
		zap.String("task_id", taskID),
		zap.String("task_type", t.Type()),
		zap.Int("retry_count", retryCount),
	)
}
