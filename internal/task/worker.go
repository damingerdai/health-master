package task

import (
	"time"

	"github.com/hibiken/asynq"
)

func NewWorker(opt asynq.RedisClientOpt) *asynq.Server {
	return asynq.NewServer(opt, asynq.Config{
		Concurrency: 3,
		Queues: map[string]int{
			"mail":    1,
			"default": 1,
		},
		ShutdownTimeout: 30 * time.Second,
	})
}

func NewServeMux(sender MailSender) *asynq.ServeMux {
	mux := asynq.NewServeMux()

	mux.HandleFunc(TypeSendMail, HandleSendMail(sender))
	mux.HandleFunc(TypeSendResetPasswordTokenMail, HandleSendResetPasswordTokenMail(sender))

	return mux
}
