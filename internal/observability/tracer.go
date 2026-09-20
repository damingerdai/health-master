package observability

import (
	"context"
	"errors"
	"strings"

	"github.com/damingerdai/health-master/pkg/setting"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func InitTracer(config setting.JaegerSettingS) (func(), error) {
	if !config.Enabled {
		return func() {}, nil
	}

	endpoint := strings.TrimSpace(config.Endpoint)
	if endpoint == "" {
		return nil, errors.New("jaeger endpoint is required when jaeger is enabled")
	}
	serviceName := strings.TrimSpace(config.ServiceName)
	if serviceName == "" {
		return nil, errors.New("jaeger service name is required when jaeger is enabled")
	}

	ctx := context.Background()

	options := []otlptracehttp.Option{otlptracehttp.WithEndpoint(endpoint)}
	if config.Insecure {
		options = append(options, otlptracehttp.WithInsecure())
	}
	exporter, err := otlptracehttp.New(ctx, options...)
	if err != nil {
		return nil, err
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(
			resource.NewWithAttributes(
				semconv.SchemaURL,
				semconv.ServiceName(serviceName),
			),
		),
	)

	otel.SetTracerProvider(tp)

	return func() {
		_ = tp.Shutdown(ctx)
	}, nil
}
