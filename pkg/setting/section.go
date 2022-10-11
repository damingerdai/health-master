package setting

import (
	"fmt"
	"net/url"
	"time"

	"github.com/damingerdai/health-master/pkg/util"
)

var secret []byte = make([]byte, 0)

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
	Secret string
	Issuer string
	Expire time.Duration
}

func (s *Setting) ReadSection(key string, value interface{}) error {
	err := s.vp.UnmarshalKey(key, value)
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
	if len(secret) == 0 {
		secret = []byte(s.Secret)
	}

	return secret
}
