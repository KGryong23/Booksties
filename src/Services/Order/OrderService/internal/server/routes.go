package server

import (
	"OrderService/internal/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	orderRoutes := r.Group("api/v1/Order")
	orderRoutes.Use(middlewares.JWTAuthMiddleware())
	{
		orderRoutes.POST("/save", s.CreateOrderAndOrderItemHandler)
		orderRoutes.POST("/saves", s.CreateOrdersAndOrderItemHandler)
		orderRoutes.GET("/delete", s.DeleteOrderHandler)
		orderRoutes.GET("/:id", s.HandleGetOrdersByUserId)
		orderRoutes.POST("/update", s.HandleUpdateOrderStatus)
		orderRoutes.POST("/cancell", s.HandleOrderCancell)
		orderRoutes.POST("/update/address", s.HandleUpdateAddress)
		orderRoutes.POST("/paginate/user", s.HandleGetOrderPaginateWithUser)
	}
	r.GET("api/v1/Order/items/:id", s.HandleGetOrderByOrderId)
	r.GET("api/v1/Order/sales", s.GetSalesByMonth)
	r.GET("api/v1/Order/sales/data", s.GetSalesData)
	r.GET("api/v1/Order/paginate", s.HandleGetOrderPaginate)
	return r
}
