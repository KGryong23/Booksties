package server

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.POST("create", s.CreateProductHandler)
	r.GET("api/v1/Search/:id", s.GetProductByIdHandler)
	r.GET("api/v1/Search/paginate", s.SearchProductHandler)
	r.GET("api/v1/Search/home", s.GetProductsHandler)

	r.GET("/health", s.HealthCheckHandler)
	return r
}

func (s *Server) HealthCheckHandler(c *gin.Context) {
	elasticsearchStatus := "healthy"
	if err := checkElasticsearchHealth(); err != nil {
		elasticsearchStatus = "unhealthy"
	}

	rabbitStatus := "healthy"
	if s.rabbitConn.IsClosed() {
		rabbitStatus = "unhealthy"
	}

	status := "healthy"
	if elasticsearchStatus == "unhealthy" || rabbitStatus == "unhealthy" {
		status = "unhealthy"
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        status,
		"elasticsearch": elasticsearchStatus,
		"rabbitmq":      rabbitStatus,
		"timestamp":     time.Now().Format(time.RFC3339),
	})
}
