package models

import (
	"time"

	"github.com/google/uuid"
)

type CreateProductDTO struct {
	ID                 uuid.UUID  `json:"id"`
	Title              string     `json:"title"`
	Author             string     `json:"author" `
	Publisher          string     `json:"publisher" `
	PublicationYear    int        `json:"publication_year" `
	Price              float64    `json:"price" `
	Description        string     `json:"description" `
	ImageURL           string     `json:"image_url" `
	SoldQuantity       int        `json:"sold_quantity" `
	AverageRating      float64    `json:"average_rating" `
	DiscountPercentage int        `json:"discount_percentage" `
	ProductType        int        `json:"product_type" `
	IsActive           bool       `json:"is_active" `
	GenreIDs           uuid.UUIDs `json:"genre_ids"`
	CreatedAt          time.Time  `json:"created_at"`
}

type UpdateProductDTO struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	Publisher          string    `json:"publisher"`
	PublicationYear    int       `json:"publication_year"`
	Price              float64   `json:"price"`
	Description        string    `json:"description"`
	ImageURL           string    `json:"image_url" `
	DiscountPercentage int       `json:"discount_percentage"`
	ProductType        int       `json:"product_type"`
	IsActive           bool      `json:"is_active"`
}

type UpdateProductGenreDTO struct {
	ID       uuid.UUID  `json:"id"`
	GenreIDs uuid.UUIDs `json:"genre_ids"`
}

type DeleteProductDTO struct {
	ID string `json:"id"`
}

type ProductDTO struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author" `
	Publisher          string    `json:"publisher" `
	PublicationYear    int       `json:"publication_year" `
	Price              float64   `json:"price" `
	Description        string    `json:"description" `
	ImageURL           string    `json:"image_url" `
	SoldQuantity       int       `json:"sold_quantity" `
	AverageRating      float64   `json:"average_rating" `
	DiscountPercentage int       `json:"discount_percentage" `
	ProductType        int       `json:"product_type" `
	IsActive           bool      `json:"is_active" `
	CreatedAt          time.Time `json:"created_at"`
}

type SearchProductDTO struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author" `
	Price              float64   `json:"price" `
	ImageURL           string    `json:"image_url" `
	SoldQuantity       int       `json:"sold_quantity" `
	AverageRating      float64   `json:"average_rating" `
	DiscountPercentage int       `json:"discount_percentage" `
}

type ReceiveUpdateSoldAndAvgRatingDTO struct {
	ID            uuid.UUID `json:"id"`
	SoldQuantity  int       `json:"sold_quantity"`
	AverageRating float64   `json:"average_rating"`
}
