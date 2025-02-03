package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.POST("api/v1/Basket/save", s.HandleCreateBasketAndBasketItem)
	r.POST("api/v1/Basket/remove", s.HandleRemoveBasketItem)
	r.GET("api/v1/Basket/:id", s.HandleClearBasketByUserId)
	r.POST("api/v1/Basket/update", s.HandleUpdateBasketItemQuantity)
	r.GET("api/v1/Basket/user/:id", s.HandleGetBasketItemsByUserId)
	// r.POST("api/v1/Basket/convert/order", s.HandleConvertingBasketIntoOrder)
	return r
}
