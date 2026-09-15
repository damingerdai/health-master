.PHONY: clean test
clean:
	rm main || rm main.exe || :
build: clean
	go build -o main main.go
run: build
	./main
test:
	go test ./...
