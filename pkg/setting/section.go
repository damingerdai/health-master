package setting

import (
	"fmt"
	"net/url"
	"time"

	"github.com/damingerdai/health-master/pkg/util"
)

type ServerSettingS struct {
	RunMode      string
	HttpPort     string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseSettingS struct {
	Host     string
	Port     string
	User     string
	Password string
	DB       string
	SSL      bool
}

type JwtSettingS struct {
	secretBytes []byte
	Secret      string
	Issuer      string
	Expire      time.Duration
}

type RedisSettingS struct {
	Host     string
	Port     int
	Password string
	DB       int
}

type Settings struct {
	Server   ServerSettingS
	Database DatabaseSettingS
	JWT      JwtSettingS
	Redis    RedisSettingS
}

func (s *Setting) ReadSection(key string, value any) error {
	err := s.vp.UnmarshalKey(key, value)
	if err != nil {
		return err
	}

	return nil
}

func (s *Setting) ReadAllSection(value any) error {
	err := s.vp.Unmarshal(value)
	if err != nil {
		return err
	}

	return nil
}

func (s *DatabaseSettingS) DBConnString() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
		s.Host,
		s.User,
		url.QueryEscape(s.Password),
		s.DB,
		s.Port,
		util.If(s.SSL, "require", "disable"))
}

func (s *JwtSettingS) GetJwtSecret() []byte {
	if len(s.secretBytes) == 0 {
		s.secretBytes = []byte(s.Secret)
	}

	return s.secretBytes
}

func (s *RedisSettingS) Addr() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}
