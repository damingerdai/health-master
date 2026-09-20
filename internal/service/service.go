package service

import (
	"github.com/damingerdai/health-master/internal/db"
	"github.com/damingerdai/health-master/internal/repository"
	"github.com/damingerdai/health-master/pkg/cryptox"
	"github.com/damingerdai/health-master/pkg/setting"
	"go.uber.org/zap"
)

type NewOption func(*newOptions)

type newOptions struct {
	totpSetting   *setting.TotpSettingS
	loggerSetting *setting.LoggerSettingS
	logger        *zap.Logger
}

func WithTotpSetting(totpSetting *setting.TotpSettingS) NewOption {
	return func(o *newOptions) {
		o.totpSetting = totpSetting
	}
}

func WithLoggerSetting(loggerSetting *setting.LoggerSettingS) NewOption {
	return func(o *newOptions) {
		o.loggerSetting = loggerSetting
	}
}

func WithLogger(logger *zap.Logger) NewOption {
	return func(o *newOptions) {
		if logger != nil {
			o.logger = logger
		}
	}
}

type Services struct {
	db     db.Connection
	logger *zap.Logger

	AuthService              *AuthService
	RoleService              *RoleService
	UserService              *UserService
	TokenService             *TokenService
	UserBloodPressureService *UserBloodPressureService
	WeightRecordService      *WeightRecordService
	UserHeightService        *UserHeightService
	UserTemperatureService   *UsersTemperaturesService
	StatisticsService        *StatisticsService
	TwoFactorService         *TwoFactorService
}

func New(db db.Connection, opts ...NewOption) *Services {
	options := &newOptions{logger: zap.NewNop()}
	for _, opt := range opts {
		if opt != nil {
			opt(options)
		}
	}
	logger := options.logger
	var (
		aes    *cryptox.AES
		issuer string
	)

	if options.totpSetting != nil {
		issuer = options.totpSetting.Issuer
		if options.totpSetting.SecretKey != "" {
			var err error
			aes, err = cryptox.NewAES(options.totpSetting.SecretKey)
			if err != nil {
				logger.Warn("failed to init 2fa aes", zap.Error(err))
			}
		}
	}

	repo := repository.New(db)
	roleRepository := repo.RoleRepository
	userRepository := repo.UserRepository
	userRoleRepository := repo.UserRoleRepository
	tokenRecordRepository := repo.TokenRecordRepository
	userBloodPressureRepository := repo.UserBloodPressureRepository
	weigthRecordRepository := repo.WeightRecordRepository
	userHeightRepository := repo.UserHeightRepository
	userTemperatureRepository := repo.UserTemperatureRepository
	tokenService := NewTokenService(userRepository, tokenRecordRepository)
	twoFactorService := NewTwoFactorService(aes, userRepository, issuer)

	return &Services{
		db:     db,
		logger: logger,

		AuthService:              NewAuthService(userRepository, tokenService, twoFactorService),
		RoleService:              NewRoleService(roleRepository),
		UserService:              NewUserService(userRepository, roleRepository, userRoleRepository, tokenRecordRepository, tokenService, logger),
		TokenService:             tokenService,
		UserBloodPressureService: NewUserBloodPressureService(userBloodPressureRepository),
		WeightRecordService:      NewWeightRecordService(weigthRecordRepository, userRepository),
		UserHeightService:        NewUserHeightService(userRepository, userHeightRepository),
		UserTemperatureService:   NewUsersTemperaturesService(*userTemperatureRepository),
		StatisticsService:        NewStatisticsService(userBloodPressureRepository, weigthRecordRepository, userTemperatureRepository, userHeightRepository),
		TwoFactorService:         twoFactorService,
	}
}
