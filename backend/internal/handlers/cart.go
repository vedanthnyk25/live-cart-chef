package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Helper function to call suggestions endpoint
func callSuggestionsEndpoint(userID uint) {
	// Get the base URL (assuming it's the same server)
	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080" // Default fallback
	}

	// Prepare request body for suggestions endpoint
	reqBody := map[string]interface{}{
		"user_id": userID,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		// Log error but don't fail the cart operation
		return
	}

	// Make async call to suggestions endpoint
	go func() {
		http.Post(baseURL+"/api/suggestions", "application/json", bytes.NewBuffer(body))
	}()
}

func AddToCart(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var input struct {
		ProductID uint `json:"product_id" binding:"required"`
		Quantity  int  `json:"quantity" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart models.Cart
	if err := db.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		// Create new cart if it doesn't exist
		cart = models.Cart{UserID: userID}
		db.DB.Create(&cart)
	}

	var item models.CartItem
	err := db.DB.Where("cart_id = ? AND product_id = ?", cart.ID, input.ProductID).First(&item).Error
	if err != nil {
		item = models.CartItem{
			CartID:    cart.ID,
			ProductID: input.ProductID,
			Quantity:  input.Quantity,
		}
		db.DB.Create(&item)
	} else {
		item.Quantity += input.Quantity
		db.DB.Save(&item)
	}

	// Check cart size and call suggestions endpoint if > 3 items
	var cartItems []models.CartItem
	db.DB.Where("cart_id = ?", cart.ID).Find(&cartItems)

	if len(cartItems) > 3 {
		callSuggestionsEndpoint(userID)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart"})
}

func GetCart(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var cart models.Cart
	err := db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	c.JSON(http.StatusOK, cart)
}

func RemoveFromCart(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var input struct {
		ProductID uint `json:"product_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart models.Cart
	if err := db.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if err := db.DB.Where("cart_id = ? AND product_id = ?", cart.ID, input.ProductID).Delete(&models.CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed"})
}
