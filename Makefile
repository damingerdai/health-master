.PHONY: clean
clean:
	rm main || rm main.exe || :
build: clean
	go build -o main main.go
run: build
	./main