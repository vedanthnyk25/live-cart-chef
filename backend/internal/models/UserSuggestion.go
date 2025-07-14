package models

import (
	"encoding/json"
	"time"
	"gorm.io/gorm"
)

type UserSuggestion struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	UserID          uint      `json:"user_id"`
	DishName        string    `json:"dish_name"`
	ExtraItemsJSON  string    `json:"extra_items_json" gorm:"type:text"`
	ExtraItems      []string  `json:"extra_items" gorm:"-"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// BeforeCreate hook to convert slice to JSON
func (us *UserSuggestion) BeforeCreate(tx *gorm.DB) error {
	if us.ExtraItems != nil {
		data, err := json.Marshal(us.ExtraItems)
		if err != nil {
			return err
		}
		us.ExtraItemsJSON = string(data)
	}
	return nil
}

// AfterFind hook to convert JSON back to slice
func (us *UserSuggestion) AfterFind(tx *gorm.DB) error {
	if us.ExtraItemsJSON != "" {
		return json.Unmarshal([]byte(us.ExtraItemsJSON), &us.ExtraItems)
	}
	return nil
}
