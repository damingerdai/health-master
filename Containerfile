FROM golang:1.26.0-alpine3.23 AS build

RUN apk update && \
    apk upgrade && \
    apk add --no-cache ca-certificates

WORKDIR /app

COPY go.mod go.sum /app/
ENV GO111MODULE=on
# ENV GOOS=linux 
# ENV GOARCH=amd64

RUN go mod download

COPY . .
RUN go build -o server main.go

FROM alpine:3.23

RUN    apk update && \
    apk upgrade && \
    apk add --no-cache tzdata

WORKDIR /app

ENV GIN_MODE="release"
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=build /app/server ./

EXPOSE 8000

CMD ["/app/server"]
