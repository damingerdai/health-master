package service

import (
	"context"
	"fmt"

	hmMail "github.com/damingerdai/health-master/internal/mail"
	"github.com/go-mail/mail/v2"
)

type MailService struct {
	mailer *hmMail.Mailer
}

func NewMailService(mailer *hmMail.Mailer) *MailService {
	return &MailService{
		mailer,
	}
}

func (s *MailService) SendMail(ctx context.Context, to, subject, body string) error {
	return s.doSendMail(to, subject, body)
}

func (s *MailService) doSendMail(to, subject, body string) error {
	msg := mail.NewMessage()
	msg.SetHeader("From", s.mailer.From())
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", body)
	d := mail.NewDialer(s.mailer.Host(), s.mailer.Port(), s.mailer.Username(), s.mailer.Password())
	port := s.mailer.Port()
	d.SSL = (port == 465)
	if err := d.DialAndSend(msg); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}

func (s *MailService) SendResetPassword(ctx context.Context, toEmail, env, link string) error {
	return s.mailer.SendResetPassword(toEmail, env, link)
}
