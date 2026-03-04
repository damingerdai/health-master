package mail

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"net/smtp"
	"time"

	"github.com/go-mail/mail/v2"
)

//go:embed templates/*.html
var templateFS embed.FS

type Mailer struct {
	host     string
	port     string
	from     string
	password string
}

func NewMailer(host, port, from, password string) *Mailer {
	return &Mailer{
		host:     host,
		port:     port,
		from:     from,
		password: password,
	}
}

type ResetPasswordData struct {
	Env  string
	Link string
	Year int
}

func (m *Mailer) SendResetPassword(toEmail, env, link string) error {
	data := ResetPasswordData{
		Env:  env,
		Link: link,
		Year: time.Now().Year(),
	}

	tmpl, err := template.ParseFS(templateFS, "templates/reset_password.html")
	if err != nil {
		return fmt.Errorf("failed to parse template: %w", err)
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	subject := "Subject: Reset your Health Master password\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	message := []byte(subject + mime + body.String())
	auth := smtp.PlainAuth("", m.from, m.password, m.host)
	addr := fmt.Sprintf("%s:%s", m.host, m.port)

	err = smtp.SendMail(addr, auth, m.from, []string{toEmail}, message)
	if err != nil {
		return fmt.Errorf("failed to send email via smtp: %w", err)
	}

	return nil
}

func (m *Mailer) SendResetPasswordV2(toEmail, env, link string) error {
	data := ResetPasswordData{
		Env:  env,
		Link: link,
		Year: time.Now().Year(),
	}

	tmpl, err := template.ParseFS(templateFS, "templates/reset_password.html")
	if err != nil {
		return fmt.Errorf("failed to parse template: %w", err)
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	subject := "Subject: Reset your Health Master password"
	msg := mail.NewMessage()
	msg.SetHeader("From", m.from)
	msg.SetHeader("To", toEmail)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", body.String())
	portInt := 587 // 或者 465
	if m.port == "465" {
		portInt = 465
	}
	d := mail.NewDialer(m.host, portInt, m.from, m.password)

	if portInt == 465 {
		d.SSL = true
	}
	if err := d.DialAndSend(msg); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}
