package models

import (
	"time"

	"github.com/google/uuid"
)

func (p Product) ProductToProductDto() *ProductDto {
	return &ProductDto{
		ID:                 p.ID,
		Title:              p.Title,
		Author:             p.Author,
		Publisher:          p.Publisher,
		PublicationYear:    p.PublicationYear,
		PageCount:          p.PageCount,
		Dimensions:         p.Dimensions,
		CoverType:          p.CoverType,
		Price:              p.Price,
		Description:        p.Description,
		ImageURL:           p.ImageURL,
		SoldQuantity:       p.SoldQuantity,
		AverageRating:      p.AverageRating,
		QuantityEvaluate:   p.QuantityEvaluate,
		DiscountPercentage: p.DiscountPercentage,
	}
}

func (p CreateProductDTO) CreateProductToSendNewProduct(id uuid.UUID) *SendNewProductDto {
	return &SendNewProductDto{
		ID:                 id,
		Title:              p.Title,
		Author:             p.Author,
		Publisher:          p.Publisher,
		PublicationYear:    p.PublicationYear,
		Price:              p.Price,
		Description:        p.Description,
		ImageURL:           p.ImageURL,
		SoldQuantity:       0,
		AverageRating:      0,
		DiscountPercentage: 0,
		ProductType:        p.ProductType,
		IsActive:           p.IsActive,
		GenreIDs:           p.GenreIDs,
		CreatedAt:          time.Now(),
	}
}

func (p UpdateProductDTO) SendUpdateProductToUpdateProductDTO() *SendUpdateProductDTO {
	return &SendUpdateProductDTO{
		ID:                 p.ID,
		Title:              p.Title,
		Author:             p.Author,
		Publisher:          p.Publisher,
		PublicationYear:    p.PublicationYear,
		Price:              p.Price,
		Description:        p.Description,
		ImageURL:           p.ImageURL,
		DiscountPercentage: p.DiscountPercentage,
		ProductType:        p.ProductType,
		IsActive:           p.IsActive,
	}
}
