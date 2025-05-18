package server

import (
	"fmt"
	"net/http"
	"os"
)

type DevServer struct {
	server *http.Server
}

func NewDevServer(server *http.Server) *DevServer {
	return &DevServer{
		server,
	}
}

func (devServer DevServer) Run() error {
	if err := devServer.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		fmt.Fprintf(os.Stderr, "listen: %s\n", err)
		return err
	}
	return nil
}
