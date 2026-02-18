package mail

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"net/smtp"
	"time"
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
