package global

import "github.com/hibiken/asynq"

var (
	AsynqClient *asynq.Client
	AsynqWorker *asynq.Server
)
