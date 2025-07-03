package models

import "time"

type CartItem struct {
	ID        uint      `gorm:"primaryKey"`
	CartID    uint      `json:"cart_id"`
	ProductID uint      `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

