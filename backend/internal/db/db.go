package db

import (
	"backend/internal/models"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
)

var DB *gorm.DB

func ConnectDB() {
	_ = godotenv.Load(".env")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}

	sqlDB.SetMaxOpenConns(25)

	err = DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Cart{}, &models.CartItem{}, &models.UserSuggestion{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
}

func CloseDB() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("Failed to get database instance for closing: %v", err)
		return
	}

	err = sqlDB.Close()
	if err != nil {
		log.Printf("Failed to close database connection: %v", err)
	} else {
		log.Println("Database connection closed successfully.")
	}
}
