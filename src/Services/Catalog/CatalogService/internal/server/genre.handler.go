package server

import (
	"CatalogService/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) GetGenresHandler(c *gin.Context) {
	genres, err := s.genreService.GetGenres()
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", genres)
}

func (s *Server) HandleGetGenreByProduct(c *gin.Context) {
	productID := c.Param("id")
	id, err := uuid.Parse(productID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	genre, err := s.genreService.GetGenreByProduct(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", genre)
}

func (s *Server) HandleUpdateProductGenre(c *gin.Context) {
	var dto models.UpdateProductGenre
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.genreService.UpdateProductGenre(dto.ProductID, dto.GenreID)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err = s.sendMessageWithRetry("update_genre", models.MqUpdateProductGenreDTO{
		ID:       dto.ProductID,
		GenreIDs: []uuid.UUID{dto.GenreID},
	})
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Update success", dto.ProductID)
}
