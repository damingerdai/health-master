package server

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type ProdServer struct {
	server *http.Server
}

func NewProdServer(server *http.Server) *ProdServer {
	return &ProdServer{
		server,
	}
}

func (prodServer ProdServer) Run() error {
	errorChan := make(chan error)
	go func() {
		if err := prodServer.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Fprintf(os.Stderr, "listen: %s\n", err)
			errorChan <- err
		}
	}()

	// https://github.com/hlandau/service/issues/10
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-quit:
		fmt.Fprint(os.Stdin, "Shutdown server...\n")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := prodServer.server.Shutdown(ctx); err != nil {
			fmt.Fprintf(os.Stderr, "Server shutdown: %s\n", err.Error())
		}
		select {
		case <-ctx.Done():
			fmt.Fprintln(os.Stderr, "5 second timeout")
		default:
			fmt.Fprintln(os.Stderr, "Server exiting")
		}

	case err := <-errorChan:
		fmt.Fprintf(os.Stderr, "fail to run server: %s\n", err)

	}

	return nil
}
