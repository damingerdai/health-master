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
	// EncodeLevel: zapcore.LowercaseLevelEncoder,
	EncodeLevel:    zapcore.CapitalColorLevelEncoder,
	EncodeTime:     zapcore.ISO8601TimeEncoder,
	EncodeDuration: zapcore.SecondsDurationEncoder,

	// EncodeCaller show the go file where Logger is invoked
	// EncodeCaller:   zapcore.FullCallerEncoder,
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

// 创建默认编码器配置 (非全局变量)
func newEncoderConfig() zapcore.EncoderConfig {
	return zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller", // 关键修复：要么删除此字段，要么设置编码器
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.CapitalLevelEncoder, // 移除颜色编码
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder, // 必须设置编码器
	}
}

// 创建完整配置
func newConfig(level zapcore.Level) zap.Config {
	return zap.Config{
		Level:            zap.NewAtomicLevelAt(level),
		Development:      false,
		Encoding:         "console",
		EncoderConfig:    newEncoderConfig(),
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
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
	var zapLevel zapcore.Level

	switch level {
	case "info":
		zapLevel = zap.InfoLevel
	case "warn":
		zapLevel = zap.WarnLevel
	case "debug":
		zapLevel = zap.DebugLevel
	default:
		return nil, fmt.Errorf("unsupported log level: %v", level)
	}

	config := newConfig(zapLevel)
	logger, err := config.Build(
		zap.AddCaller(),      // 添加调用者信息
		zap.AddCallerSkip(1), // 跳过一层调用栈
	)
	if err != nil {
		return nil, fmt.Errorf("failed to build logger: %w", err)
	}

	return logger, nil
}

// 辅助函数：创建默认日志记录器
func MustLogger(level string) *zap.Logger {
	logger, err := NewLogger(level)
	if err != nil {
		// 回退到基础日志记录器
		fallback := zap.NewExample()
		fallback.Error("Failed to create logger, using fallback", zap.Error(err))
		return fallback
	}
	return logger
}
