package models

import "time"

type Suggestion struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Title     string    `json:"title"`
	Items     string    `json:"items"`  // Comma-separated list of product IDs/names
	Reason    string    `json:"reason"` // Why it was recommended
	Timestamp time.Time `json:"timestamp"`
	User      User      `gorm:"foreignKey:UserID"`
}

