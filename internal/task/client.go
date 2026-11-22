package task

import "github.com/hibiken/asynq"

func NewAsynq(opt asynq.RedisClientOpt) *asynq.Client {
	return asynq.NewClient(opt)
}
