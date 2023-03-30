package setting

import (
	"strings"

	"github.com/spf13/viper"
)

type Setting struct {
	vp *viper.Viper
}

func NewSetting() (*Setting, error) {
	vp := viper.New()
	vp.SetConfigName("config")
	vp.AddConfigPath("configs")
	vp.SetConfigType("yaml")
	vp.AutomaticEnv()
	replacer := strings.NewReplacer(".", "_")
	vp.SetEnvKeyReplacer(replacer)
	err := vp.ReadInConfig()
	if err != nil {
		return nil, err
	}

	return &Setting{vp}, nil
}
