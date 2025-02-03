package server

import (
	"ReviewService/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) AddOrUpdateReviewHandler(c *gin.Context) {
	var req models.AddOrUpdateReviewDto
	if err := c.ShouldBindJSON(&req); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}

	err := s.reviewService.AddOrUpdateReview(&req)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	review, err := s.reviewService.AvgRatingAndTotalReview(req.ProductID)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err = s.sendMessageWithRetry(review)
	if err != nil {
		models.ErrorResponse(c, 301, "sending message failed")
		return
	}
	models.SuccessResponse(c, 201, "Add or update review success", req.ProductID)
}

func (s *Server) DeleteReviewHandler(c *gin.Context) {
	var req models.DeleteReviewDto
	if err := c.ShouldBindJSON(&req); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}

	err := s.reviewService.DeleteReview(&req)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Delete review success", req.ProductID)
}

func (s *Server) HandleGetReviewByProdID(c *gin.Context) {
	productID := c.Param("id")
	id, err := uuid.Parse(productID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	data, err := s.reviewService.GetReviewByProdID(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get review success", data)
}
