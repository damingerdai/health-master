package mail

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"strconv"
	"time"

	"github.com/go-mail/mail/v2"
)

//go:embed templates/*.html
var templateFS embed.FS

type Mailer struct {
	host     string
	port     string
	username string
	password string
	from     string
}

func NewMailer(host, port, username, password, from string) *Mailer {
	return &Mailer{
		host:     host,
		port:     port,
		username: username,
		password: password,
		from:     from,
	}
}

func (m *Mailer) Host() string {
	return m.host
}

func (m *Mailer) Port() int {
	portInt, err := strconv.Atoi(m.port)
	if err != nil {
		portInt = 465
	}

	return portInt
}

func (m *Mailer) Username() string {
	return m.username
}

func (m *Mailer) Password() string {
	return m.password
}

func (m *Mailer) From() string {
	return m.from
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

	subject := "Subject: Reset your Health Master password"
	msg := mail.NewMessage()
	msg.SetHeader("From", m.from)
	msg.SetHeader("To", toEmail)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", body.String())
	portInt, err := strconv.Atoi(m.port)
	if err != nil {
		portInt = 465
	}

	d := mail.NewDialer(m.host, portInt, m.username, m.password)

	d.SSL = (portInt == 465)
	if err := d.DialAndSend(msg); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}
