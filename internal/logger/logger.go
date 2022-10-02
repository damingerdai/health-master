package logger

import (
	"os"

	log "github.com/sirupsen/logrus"
)

type Level int8

type Fields map[string]interface{}

const (
	LevelTrace Level = iota
	LevelDebug
	LevelInfo
	LevelWarn
	LevelError
	LevelFatal
	LevelPanic
)

type Logger struct {
	newLogger *log.Logger
}

func (l Level) String() string {
	switch l {
	case LevelTrace:
		return "trace"
	case LevelDebug:
		return "debug"
	case LevelInfo:
		return "info"
	case LevelWarn:
		return "warn"
	case LevelError:
		return "error"
	case LevelFatal:
		return "fatal"
	case LevelPanic:
		return "panic"
	}
	return ""
}

func ParseLevel(level Level) log.Level {
	logLevel, err := log.ParseLevel(level.String())
	if err != nil {
		logLevel = log.InfoLevel
	}
	return logLevel
}

func NewLogger(level Level) *log.Logger {
	logger := log.New()

	logger.SetFormatter(&log.TextFormatter{ForceColors: false, FullTimestamp: true})
	logger.SetOutput(os.Stdout)
	log.SetFormatter(&log.TextFormatter{ForceColors: false, FullTimestamp: true})
	log.SetOutput(os.Stdout)

	logLevel, err := log.ParseLevel(level.String())
	if err != nil {
		logLevel = log.InfoLevel
	}
	logger.SetLevel(logLevel)
	log.SetLevel(logLevel)

	return logger

}
