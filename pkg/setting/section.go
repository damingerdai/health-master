package setting

import "time"

type ServerSettingS struct {
	RunMode      string
	HttpPort     string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

func (s *Setting) ReadSection(key string, value interface{}) error {
	err := s.vp.UnmarshalKey(key, value)
	if err != nil {
		return err
	}

	return nil
}
