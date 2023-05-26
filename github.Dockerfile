FROM golang:1.20.4-alpine3.18 AS build

RUN apk update && \
    apk upgrade && \
    apk add --no-cache ca-certificates

WORKDIR /app

COPY go.mod go.sum /app/
ENV GO111MODULE=on
ENV GOPROXY=https://goproxy.cn
# ENV GOOS=linux 
# ENV GOARCH=amd64

RUN go mod download

COPY . .
RUN go build -o server main.go

FROM alpine:3.18

RUN    apk update && \
    apk upgrade && \
    apk add --no-cache tzdata

WORKDIR /app

ENV GIN_MODE="release"
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=build /app/server ./
# COPY --from=build /app/configs/ ./configs

HEALTHCHECK CMD curl --fail http://localhost:8000/ping || exit 1

EXPOSE 8000

CMD ["/app/server"]
