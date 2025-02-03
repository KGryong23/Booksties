package services

import (
	"CatalogService/internal/models"
	"CatalogService/internal/repositories"

	"github.com/google/uuid"
)

type ProductService interface {
	GetProductById(id uuid.UUID) (*models.Product, error)
	GetListProducts(field string, order string, page int, limit int, rating float64, genre_id *uuid.UUID, search_term *string) (*[]models.Product, error)
	UpdateProduct(product *models.UpdateProductDTO) error
	UpdateSoldQuantity(products []models.ReceiveSoldDto) error
	UpdateReview(product *models.ReceiveReviewDto) error
	DeleteProduct(id uuid.UUID) error
	DeleteProductMq(id uuid.UUID) error
	GetProductInBasketItem(productIDs []string) (*[]models.GetProductInBasketItemsDto, error)
	GetProductInOrderItem(productIDs []string) (*[]models.GetProductInOrderItemsDto, error)
	GetProductToUpdate(productID uuid.UUID) (*models.SendUpdateSoldAndAvgRatingDTO, error)
	GetProductsTop() ([]models.ProductTopDTO, error)
	GetAllTitle() ([]models.TileDto, error)
}

type ProductServiceImpl struct {
	productRepo repositories.ProductRepository
}

func NewProductService(
	productRepo repositories.ProductRepository,
) ProductService {
	return &ProductServiceImpl{
		productRepo: productRepo,
	}
}

func (p *ProductServiceImpl) GetProductById(id uuid.UUID) (*models.Product, error) {
	return p.productRepo.GetProductById(id)
}

func (p *ProductServiceImpl) UpdateProduct(product *models.UpdateProductDTO) error {
	return p.productRepo.UpdateProduct(product)
}

func (p *ProductServiceImpl) DeleteProduct(id uuid.UUID) error {
	return p.productRepo.DeleteProduct(id)
}

func (p *ProductServiceImpl) DeleteProductMq(id uuid.UUID) error {
	return p.productRepo.DeleteProduct(id)
}

func (p *ProductServiceImpl) GetListProducts(field string, order string, page int, limit int, rating float64, genre_id *uuid.UUID, search_term *string) (*[]models.Product, error) {
	return p.productRepo.GetListProducts(
		field,
		order,
		page,
		limit,
		rating,
		genre_id,
		search_term,
	)
}

func (p *ProductServiceImpl) GetProductInBasketItem(productIDs []string) (*[]models.GetProductInBasketItemsDto, error) {
	return p.productRepo.GetProductInBasketItem(productIDs)
}

func (p *ProductServiceImpl) GetProductInOrderItem(productIDs []string) (*[]models.GetProductInOrderItemsDto, error) {
	return p.productRepo.GetProductInOrderItem(productIDs)
}

func (p *ProductServiceImpl) UpdateSoldQuantity(products []models.ReceiveSoldDto) error {
	return p.productRepo.UpdateSoldQuantity(products)
}

func (p *ProductServiceImpl) UpdateReview(product *models.ReceiveReviewDto) error {
	return p.productRepo.UpdateReview(product)
}

func (p *ProductServiceImpl) GetProductToUpdate(productID uuid.UUID) (*models.SendUpdateSoldAndAvgRatingDTO, error) {
	return p.productRepo.GetProductToUpdate(productID)
}

func (p *ProductServiceImpl) GetProductsTop() ([]models.ProductTopDTO, error) {
	return p.productRepo.GetProductsTop()
}

func (p *ProductServiceImpl) GetAllTitle() ([]models.TileDto, error) {
	return p.productRepo.GetAllTitle()
}
