package models

import "time"

type Cart struct {
	ID        uint       `gorm:"primaryKey"`
	UserID    uint       `gorm:"unique" json:"user_id"` 
	User      User       `gorm:"foreignKey:UserID"`
	Items     []CartItem `gorm:"foreignKey:CartID" json:"items"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
