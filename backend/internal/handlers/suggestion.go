package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings" // Import the strings package

	"github.com/gin-gonic/gin"
)

// Define a struct for the outer response
type OuterResponse struct {
	Content struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
		Role string `json:"role"`
	} `json:"content"`
	UsageMetadata struct {
		CandidatesTokenCount int `json:"candidatesTokenCount"`
		CandidatesTokensDetails []struct {
			Modality string `json:"modality"`
			TokenCount int `json:"tokenCount"`
		} `json:"candidatesTokensDetails"`
		PromptTokenCount int `json:"promptTokenCount"`
		PromptTokensDetails []struct {
			Modality string `json:"modality"`
			TokenCount int `json:"tokenCount"`
		} `json:"promptTokensDetails"`
		TotalTokenCount int `json:"totalTokenCount"`
	} `json:"usageMetadata"`
	InvocationID string `json:"invocationId"`
	Author string `json:"author"`
	Actions struct {
		StateDelta map[string]interface{} `json:"stateDelta"`
		ArtifactDelta map[string]interface{} `json:"artifactDelta"`
		RequestedAuthConfigs map[string]interface{} `json:"requestedAuthConfigs"`
	} `json:"actions"`
	ID string `json:"id"`
	Timestamp float64 `json:"timestamp"`
}

func GetSuggestions(c *gin.Context) {
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID missing"})
		return
	}

	// Get user's cart items
	var cart models.Cart
	err := db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Extract cart item names
	var cartItems []string
	for _, item := range cart.Items {
		cartItems = append(cartItems, item.Product.Name)
	}

	// Convert cart items to JSON string
	presentCartJSON, err := json.Marshal(cartItems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize cart items"})
		return
	}

	// Get all available products
	var products []models.Product
	if err := db.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Extract product names
	var stockItems []string
	for _, product := range products {
		stockItems = append(stockItems, product.Name)
	}

	// Convert stock items to JSON string
	itemsInStockJSON, err := json.Marshal(stockItems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize stock items"})
		return
	}

	mcoURL := os.Getenv("MCO_URL")
	if mcoURL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MCO URL not found"})
		return
	}

	// Create the text content with cart and stock information
	textContent := fmt.Sprintf("user_id: %v\npresent_cart_json: %s\nitems_in_stock_json: %s",
		userID,
		string(presentCartJSON),
		string(itemsInStockJSON))

	reqBody := map[string]interface{}{
		"appName":   "multi_tool_agent",
		"userId":    "test_u_1",
		"sessionId": "test_s_1",
		"newMessage": map[string]interface{}{
			"role": "user",
			"parts": []map[string]interface{}{
				{
					"text": textContent,
				},
			},
		},
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize the request body"})
		return
	}

	res, err := http.Post(mcoURL+"/run", "application/json", bytes.NewBuffer(body))
	if err != nil || res.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get suggestions from MCO"})
		return
	}

	// Read the response body
	responseBody, err := io.ReadAll(res.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
		return
	}

	var outerResponse []OuterResponse
	if err := json.Unmarshal(responseBody, &outerResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse the outer response"})
		return
	}

	// Extract the inner JSON string
	innerJSON := outerResponse[0].Content.Parts[0].Text

	// Clean the inner JSON string by removing markdown code block syntax
	innerJSON = strings.TrimPrefix(innerJSON, "```json")
	innerJSON = strings.TrimSuffix(innerJSON, "```")
	innerJSON = strings.TrimSpace(innerJSON)

	// Unmarshal the inner JSON into a slice of models.Suggestion
	var suggestions []models.Suggestion
	err = json.Unmarshal([]byte(innerJSON), &suggestions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse the actual suggestions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"suggestions": suggestions,
	})
}
