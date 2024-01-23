package setting

import (
	"fmt"
	"reflect"
	"strings"
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

type LoggerSettingS struct {
	Level string
}

type Settings struct {
	Server   ServerSettingS
	Database DatabaseSettingS
	JWT      JwtSettingS
	Redis    RedisSettingS
	Logger   LoggerSettingS
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

func (s *Setting) BindEnvs(iface any, parts ...string) {
	ifv := reflect.ValueOf(iface)
	ift := reflect.TypeOf(iface)
	for i := 0; i < ift.NumField(); i++ {
		v := ifv.Field(i)
		t := ift.Field(i)
		tv, ok := t.Tag.Lookup("mapstructure")
		if !ok {
			tv = strings.ToUpper(t.Name)
		}
		switch v.Kind() {
		case reflect.Struct:
			s.BindEnvs(v.Interface(), append(parts, tv)...)
		default:
			s.vp.BindEnv(strings.Join(append(parts, tv), "."))
		}
	}
}

func (s *DatabaseSettingS) DBConnString() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
		s.Host,
		s.User,
		s.Password,
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
