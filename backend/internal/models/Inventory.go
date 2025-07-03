package models

type Inventory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `json:"product_id"`
	Location  string    `json:"location"`
	Quantity  int       `json:"quantity"`
	Product   Product   `gorm:"foreignKey:ProductID"`
}
