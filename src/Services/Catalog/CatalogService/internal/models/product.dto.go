package models

import (
	"time"

	"github.com/google/uuid"
)

type ProductDto struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	Publisher          string    `json:"publisher"`
	PublicationYear    int       `json:"publication_year"`
	PageCount          int       `json:"page_count"`
	Dimensions         string    `json:"dimensions"`
	CoverType          string    `json:"cover_type"`
	Price              float64   `json:"price"`
	Description        string    `json:"description"`
	ImageURL           string    `json:"image_url"`
	SoldQuantity       int       `json:"sold_quantity"`
	AverageRating      float64   `json:"average_rating"`
	QuantityEvaluate   int       `json:"quantity_evaluate"`
	DiscountPercentage int       `json:"discount_percentage"`
}

type CreateProductDTO struct {
	Title               string     `json:"title" binding:"required"`
	Author              string     `json:"author"`
	Publisher           string     `json:"publisher"`
	PublicationYear     int        `json:"publication_year"`
	PageCount           int        `json:"page_count"`
	Dimensions          string     `json:"dimensions"`
	CoverType           string     `json:"cover_type"`
	Price               float64    `json:"price"`
	Description         string     `json:"description"`
	ImageURL            *string    `json:"image_url"`
	ProductType         int        `json:"product_type"`
	IsActive            bool       `json:"is_active"`
	InitializeWarehouse int        `json:"initialize_warehouse"`
	OriginalOwnerID     *uuid.UUID `json:"original_owner_id"`
	GenreIDs            uuid.UUIDs `json:"genre_ids"`
}

type UpdateProductDTO struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	Publisher          string    `json:"publisher"`
	PublicationYear    int       `json:"publication_year"`
	PageCount          int       `json:"page_count"`
	Dimensions         string    `json:"dimensions"`
	CoverType          string    `json:"cover_type"`
	Price              float64   `json:"price"`
	Description        string    `json:"description"`
	ImageURL           *string   `json:"image_url"`
	DiscountPercentage int       `json:"discount_percentage"`
	ProductType        int       `json:"product_type"`
	IsActive           bool      `json:"is_active"`
}

type SendNewProductDto struct {
	ID                 uuid.UUID  `json:"id"`
	Title              string     `json:"title"`
	Author             string     `json:"author" `
	Publisher          string     `json:"publisher" `
	PublicationYear    int        `json:"publication_year" `
	Price              float64    `json:"price" `
	Description        string     `json:"description" `
	ImageURL           *string    `json:"image_url" `
	SoldQuantity       int        `json:"sold_quantity" `
	AverageRating      float64    `json:"average_rating" `
	DiscountPercentage int        `json:"discount_percentage" `
	ProductType        int        `json:"product_type" `
	IsActive           bool       `json:"is_active" `
	GenreIDs           uuid.UUIDs `json:"genre_ids"`
	CreatedAt          time.Time  `json:"created_at"`
}

type SendUpdateProductDTO struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	Publisher          string    `json:"publisher"`
	PublicationYear    int       `json:"publication_year"`
	Price              float64   `json:"price"`
	Description        string    `json:"description"`
	ImageURL           *string   `json:"image_url"`
	DiscountPercentage int       `json:"discount_percentage"`
	ProductType        int       `json:"product_type"`
	IsActive           bool      `json:"is_active"`
}

type DeleteProductDTO struct {
	ID string `json:"id"`
}

type GetProductInBasketItemsDto struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	DiscountPercentage int       `json:"discount_percentage"`
	ImageURL           *string   `json:"image_url"`
	Price              float64   `json:"price"`
}

type GetProductInOrderItemsDto struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Author   string    `json:"author"`
	ImageURL *string   `json:"image_url"`
}

type AddInventoryDto struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type DeleteInventoryByProdIDDto struct {
	ProductID uuid.UUID `json:"product_id"`
}

type ReceiveSoldDto struct {
	ProductID    uuid.UUID `json:"product_id"`
	SoldQuantity int       `json:"sold_quantity"`
}

type ReceiveReviewDto struct {
	ProductID        uuid.UUID `json:"product_id"`
	AverageRating    float64   `json:"average_rating"`
	QuantityEvaluate int       `json:"quantity_evaluate"`
}

type SendUpdateSoldAndAvgRatingDTO struct {
	ID            uuid.UUID `json:"id"`
	SoldQuantity  int       `json:"sold_quantity"`
	AverageRating float64   `json:"average_rating"`
}

type MqUpdateProductGenreDTO struct {
	ID       uuid.UUID  `json:"id"`
	GenreIDs uuid.UUIDs `json:"genre_ids"`
}

type ProductTopDTO struct {
	ID            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	SoldQuantity  int       `json:"sold_quantity" `
	AverageRating float64   `json:"average_rating" `
}

type TileDto struct {
	Title string `json:"title"`
}
