package logger

import (
	"fmt"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var encoderConfig = zapcore.EncoderConfig{
	TimeKey:       "time",
	LevelKey:      "level",
	NameKey:       "logger",
	CallerKey:     "caller",
	MessageKey:    "msg",
	StacktraceKey: "stacktrace",
	LineEnding:    zapcore.DefaultLineEnding,

	// EncodeLevel color the log message
	//EncodeLevel: zapcore.LowercaseLevelEncoder,
	EncodeLevel:    zapcore.CapitalColorLevelEncoder,
	EncodeTime:     zapcore.ISO8601TimeEncoder,
	EncodeDuration: zapcore.SecondsDurationEncoder,

	// EncodeCaller show the go file where Logger is invoked
	//EncodeCaller:   zapcore.FullCallerEncoder,
	EncodeCaller: nil,
}

var config = zap.Config{
	// Level:       zap.NewAtomicLevelAt(zap.DebugLevel),
	Development: false,
	Encoding:    "console",
	// Encoding:    "json",
	EncoderConfig: encoderConfig,
	// InitialFields:    map[string]interface{}{"serviceName": "iden3-demo"},
	OutputPaths:      []string{"stdout"},
	ErrorOutputPaths: []string{"stderr"},
}

func getLogLevel(level string) (*zap.AtomicLevel, error) {
	var atom zap.AtomicLevel

	switch level {
	case "info":
		atom = zap.NewAtomicLevelAt(zap.InfoLevel)
	case "warn":
		atom = zap.NewAtomicLevelAt(zap.WarnLevel)
	case "debug":
		atom = zap.NewAtomicLevelAt(zap.DebugLevel)
	default:
		return nil, fmt.Errorf("unsupport log level: %v", level)
	}
	return &atom, nil
}

func NewLogger(level string) (*zap.Logger, error) {
	logLevel, err := getLogLevel(level)
	if err != nil {
		return nil, err
	}
	config.Level = *logLevel

	log, err := config.Build()
	if err != nil {
		return nil, err
	}
	return log, err
}
