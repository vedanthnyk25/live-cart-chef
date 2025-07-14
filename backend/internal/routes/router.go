package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
  "backend/internal/handlers"
	"backend/internal/middleware"
)

func SetupRoutes(r *gin.Engine) {
	
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to the backend API!",
		})
	})

	auth:= r.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
	}

	api:= r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.POST("/products/add", handlers.AddProduct)
		api.GET("/products", handlers.GetAllProducts)
		api.GET("/cart", handlers.GetCart)
		api.POST("/cart/add", handlers.AddToCart)
		api.DELETE("/cart/delete", handlers.RemoveFromCart)
		//api.POST("/event/cart-update", handlers.NotifyCartUpdate)
		api.GET("/suggestions", handlers.GetSuggestions)
		api.GET("/suggestions/stored", handlers.GetStoredSuggestions)
		api.GET("/suggestions/available", handlers.CheckSuggestionsAvailable)
		api.DELETE("/suggestions/clear", handlers.ClearSuggestions)
	}
}
