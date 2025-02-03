package server

import (
	"CatalogService/internal/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()
	r.Static("/images", "./images")
	r.GET("api/v1/Product/:id", s.GetProductByIDHander)
	productRoutes := r.Group("api/v1/Product")
	productRoutes.Use(middlewares.JWTAuthMiddleware())
	{
		productRoutes.POST("/save", middlewares.RequirePermission("create_product"), s.CreateProductHandler)
		productRoutes.POST("/update", middlewares.RequirePermission("update_product"), s.UpdateProductHandler)
		productRoutes.GET("/delete/:id", middlewares.RequirePermission("delete_product"), s.DeleteProductHandler)
		productRoutes.GET("/paginate", middlewares.RequirePermission("view_products"), s.GetListProductsHandler)
	}
	r.GET("api/v1/Product/top", s.HandlerGetProducsTop)
	r.GET("api/v1/Product/title", s.HandleGetAllTitle)
	genreRoutes := r.Group("api/v1/Genre")
	{
		genreRoutes.GET("/", s.GetGenresHandler)
		genreRoutes.GET("/product/:id", s.HandleGetGenreByProduct)
		genreRoutes.POST("/", s.HandleUpdateProductGenre)
	}
	return r
}
