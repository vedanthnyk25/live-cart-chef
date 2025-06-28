# 🧠 Live Cart Chef — Go Backend

This is the backend API service for **Live Cart Chef**, built for Walmart Sparkathon 2025. It powers cart management, product browsing, and event-based recommendations using Go, Gin, GORM, and PostgreSQL.

---

## ✅ Features

- REST APIs for products, cart, and suggestions (WIP)
- PostgreSQL integration via Docker Compose
- Graceful shutdown with animated terminal output
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

### 3. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d

### 4. Run the server
###Make sure you are in backend directory
```bash
option-1: Using Go directly
```bash
go run cmd/server/main.go

option-2: Using Makefile
```bash
make run

###Server will start at: http://localhost:8080

### 5.Terminate the server
```bash
ctrl + C
