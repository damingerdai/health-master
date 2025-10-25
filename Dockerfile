FROM golang:1.25.3-alpine3.22 AS build

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk update && \
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

FROM alpine:3.22

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk update && \
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
