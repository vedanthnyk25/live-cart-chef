# 🧠 Live Cart Chef — Go Backend

This is the backend API service for **Live Cart Chef**, built for Walmart Sparkathon 2025. It powers cart management, product browsing, and event-based recommendations using Go, Gin, GORM, and PostgreSQL.

---

## ✅ Features

- REST APIs for products, cart, and suggestions (WIP)
- PostgreSQL integration via Docker Compose
- Graceful shutdown with connection pooling 
- Organized, extensible project structure
- Simple Makefile for common dev tasks

---

## 📦 Requirements

- Go 1.20+
- Docker + Docker Compose
- Make (optional but helpful)

---

## 🚀 Getting Started

```bash
### 1. Clone the repo
git clone https://github.com/your-org/live-cart-chef.git
cd live-cart-chef/backend

### 2.Setup .env file
cp .env.example .env

### Be sure you are in backend directory
### 3. Start the application with Docker Compose
docker-compose up --build

###If you have go installed, you can also run the server directly without Docker.
### 4. Run the server
###Make sure you are in backend directory
option-1: Using Go directly
go run cmd/server/main.go

option-2: Using Makefile
make run

###Server will start at: http://localhost:8080

### 5.Terminate the server
ctrl + C
