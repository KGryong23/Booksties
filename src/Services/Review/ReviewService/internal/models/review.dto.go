package models

import (
	"time"

	"github.com/google/uuid"
)

type AddOrUpdateReviewDto struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"user_name"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
}

type DeleteReviewDto struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
}

type SendReviewDto struct {
	ProductID        uuid.UUID `json:"product_id"`
	AverageRating    float64   `json:"average_rating"`
	QuantityEvaluate int       `json:"quantity_evaluate"`
}

type GetReviewByProdIDDto struct {
	ReviewID  uuid.UUID `json:"review_id"`
	Username  string    `json:"user_name"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	UpdatedAt time.Time `json:"updated_at"`
}
