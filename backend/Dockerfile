# Start from the official Go image (minimal base)
FROM golang:1.22-alpine

ENV GOTOOLCHAIN=auto


# Set working directory inside container
WORKDIR /app

# Install git and other dependencies (needed for Go modules)
RUN apk add --no-cache git

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the full source code
COPY . .

# Build the Go binary
RUN go build -o server ./cmd/server

# Expose the port your server runs on
EXPOSE 8080

# Set environment to production (optional)
ENV GIN_MODE=release

RUN apk add --no-cache bash

COPY wait-for-it.sh .

CMD ["./wait-for-it.sh", "db:5432", "--", "./server"]
