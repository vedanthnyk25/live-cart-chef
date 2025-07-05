package handlers

import (
	"backend/internal/models"
	"encoding/json"
	"net/http"
	"bytes"
	"os"

	"github.com/gin-gonic/gin"
)

func GetSuggestions(c *gin.Context) {
	userID, ok:= c.Get("user_id")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID missing"})
		return
	}

	mcoURL:= os.Getenv("MCO_URL")
	if mcoURL=="" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MCO URL not found"})
		return
	}

	reqBody:= map[string]interface{}{
		"user_id": userID,
	}
	body, err:= json.Marshal(reqBody)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize the request body"})
		return
	}
	
	res, err:= http.Post(mcoURL+"/suggestions", "application/json", bytes.NewBuffer(body))
	if err!=nil || res.StatusCode!=http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get suggestions from MCO"})
		return
	}
	var suggestions []models.Suggestion
	if err:= json.NewDecoder(res.Body).Decode(&suggestions); err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse the suggestions"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"suggestions": suggestions,
	})
}
