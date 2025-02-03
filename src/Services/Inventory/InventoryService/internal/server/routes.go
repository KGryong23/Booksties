package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()
	r.POST("api/v1/Inventory/check", s.HandleCheckStock)
	r.GET("api/v1/Inventory/:id", s.HandleGetInventoryByProdID)
	r.GET("api/v1/Inventory/transaction/:id", s.HandleGetTransactionByInventory)
	r.POST("api/v1/Inventory/update", s.HandleUpdateInventory)
	return r
}
