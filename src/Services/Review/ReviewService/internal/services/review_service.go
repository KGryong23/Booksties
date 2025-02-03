package services

import (
	"ReviewService/internal/models"
	"ReviewService/internal/repositories"

	"github.com/google/uuid"
)

type ReviewService interface {
	AddOrUpdateReview(review *models.AddOrUpdateReviewDto) error
	DeleteReview(review *models.DeleteReviewDto) error
	AvgRatingAndTotalReview(productID uuid.UUID) (*models.SendReviewDto, error)
	GetReviewByProdID(productID uuid.UUID) ([]models.GetReviewByProdIDDto, error)
}

type ReviewServiceImpl struct {
	reviewRepo repositories.ReviewRepository
}

func NewReviewService(reviewRepo repositories.ReviewRepository) ReviewService {
	return &ReviewServiceImpl{
		reviewRepo: reviewRepo,
	}
}

func (r *ReviewServiceImpl) AddOrUpdateReview(review *models.AddOrUpdateReviewDto) error {
	return r.reviewRepo.AddOrUpdateReview(review)
}

func (r *ReviewServiceImpl) DeleteReview(review *models.DeleteReviewDto) error {
	return r.reviewRepo.DeleteReview(review)
}

func (r *ReviewServiceImpl) AvgRatingAndTotalReview(productID uuid.UUID) (*models.SendReviewDto, error) {
	return r.reviewRepo.AvgRatingAndTotalReview(productID)
}

func (r *ReviewServiceImpl) GetReviewByProdID(productID uuid.UUID) ([]models.GetReviewByProdIDDto, error) {
	return r.reviewRepo.GetReviewByProdID(productID)
}
