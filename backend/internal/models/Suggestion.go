package models

type Suggestion struct {
    DishName          string   `json:"dish_name"`
    ExtraItemsRequired []string `json:"extra_items_required"`
}