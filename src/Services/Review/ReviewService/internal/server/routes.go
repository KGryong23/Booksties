package server

import (
	"ReviewService/internal/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()
	r.GET("api/v1/Review/:id", s.HandleGetReviewByProdID)
	reviewRoutes := r.Group("api/v1/Review")

	reviewRoutes.Use(middlewares.JWTAuthMiddleware())
	{
		reviewRoutes.POST("/add", s.AddOrUpdateReviewHandler)
		reviewRoutes.POST("/delete", s.DeleteReviewHandler)
	}
	return r
}
