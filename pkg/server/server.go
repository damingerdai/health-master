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

type Server interface {
	Run() error
}

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

func New(server *http.Server, runMode string) (Server, error) {
	fmt.Fprintf(os.Stdin, "health master is in run mode: %s\n", runMode)
	if runMode == "release" {
		return NewProdServer(server), nil
	} else if runMode == "debug" {
		return NewDevServer(server), nil
	}

	return nil, fmt.Errorf("no support %s server", runMode)
}
