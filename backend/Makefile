.PHONY: run build test migrate tidy fmt lint

# Run the server
run:
	@bash -c 'go run cmd/server/main.go || exit 0'

# Build binary
build:
	go build -o bin/server cmd/server/main.go

# Run all tests
test:
	go test ./... -v

# Tidy go.mod/go.sum
tidy:
	go mod tidy

# Format all code
fmt:
	go fmt ./...

# Lint (if golangci-lint is installed)
lint:
	golangci-lint run

# Auto-migrate models
migrate:
	go run scripts/migrate.go
