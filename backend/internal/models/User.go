package models

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `json:"name"`
	Email      string         `gorm:"uniqueIndex" json:"email"`
	Password   string         `json:"password"`
	Preferences string        `json:"preferences"`
	CreatedAt  int64          `json:"created_at"`
}

