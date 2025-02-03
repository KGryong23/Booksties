package server

import (
	"SearchService/internal/models"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func (s *Server) CreateProductHandler(c *gin.Context) {
	var product models.CreateProductDTO
	if err := c.ShouldBindJSON(&product); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	res, err := s.productService.CreateProduct(product)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Create product success", res)
}

func (s *Server) GetProductByIdHandler(c *gin.Context) {
	productID := c.Param("id")
	data := s.productService.GetProductById(productID)
	if data == nil {
		models.ErrorResponse(c, 301, "No data")
		return
	}
	models.SuccessResponse(c, 201, "Get product success", data)
}

func (s *Server) SearchProductHandler(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		models.ErrorResponse(c, 301, "Invalid query")
		return
	}
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid page")
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "8"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid limit")
		return
	}
	minRating, err := strconv.ParseFloat(c.DefaultQuery("min_rating", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid rating")
		return
	}
	minPrice, err := strconv.ParseFloat(c.DefaultQuery("min_price", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid price")
		return
	}
	maxPrice, err := strconv.ParseFloat(c.DefaultQuery("max_price", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid price")
		return
	}
	sortBy := c.Query("sort_by")
	products, totalHits, err := s.productService.SearchProducts(query, minRating, minPrice, maxPrice, sortBy, limit, page)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.PaginateResponse(c, 201, "Search success", page, limit, int(totalHits), products)
}

func (s *Server) GetProductsHandler(c *gin.Context) {
	genre := c.Query("genre")
	genre = strings.TrimSuffix(genre, "?")
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid page")
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "8"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid limit")
		return
	}
	minRating, err := strconv.ParseFloat(c.DefaultQuery("min_rating", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid rating")
		return
	}
	minPrice, err := strconv.ParseFloat(c.DefaultQuery("min_price", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid price")
		return
	}
	maxPrice, err := strconv.ParseFloat(c.DefaultQuery("max_price", "0"), 64)
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid price")
		return
	}
	sortBy := c.Query("sort_by")
	products, totalHits, err := s.productService.GetProducts(genre, minRating, minPrice, maxPrice, sortBy, limit, page)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.PaginateResponse(c, 201, "Get success", page, limit, int(totalHits), products)
}
