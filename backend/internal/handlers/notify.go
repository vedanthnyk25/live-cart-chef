package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func NotifyCartUpdate(c *gin.Context) {
	userID, ok:= c.Get("user_id")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID missing"})
		return
	}

  var cart models.Cart
	
	err:= db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error
	if err!=nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	payload, err:= json.Marshal(cart)
	if err!=nil {
		log.Println("Failed to serialize the cart:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process the cart"})
		return
	}

	mcoURL:= os.Getenv("MCO_URL")
	res, err:= http.Post(mcoURL+"/notify", "application/json", bytes.NewBuffer(payload))
	if err!=nil || res.StatusCode!=http.StatusOK {
		log.Println("Failed to notify MCO:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to notify MCO"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart updated successfully"})
}
