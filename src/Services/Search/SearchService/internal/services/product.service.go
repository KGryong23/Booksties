package services

import (
	"SearchService/internal/models"
	"SearchService/internal/repositories"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/get"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/index"
)

type ProductService interface {
	CreateProduct(product models.CreateProductDTO) (*index.Response, error)
	GetProductById(id string) *get.Response
	UpdateProduct(product models.UpdateProductDTO) error
	DeleteProduct(id string) error
	SearchProducts(query string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error)
	GetProducts(genre string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error)
	UpdateSoldAndRating(product models.ReceiveUpdateSoldAndAvgRatingDTO) error
	UpdateProductGenre(genre models.UpdateProductGenreDTO) error
}

type ProductServiceImpl struct {
	productRepo repositories.ProductRepository
}

func NewProductService(productRepo repositories.ProductRepository) ProductService {
	return &ProductServiceImpl{
		productRepo: productRepo,
	}
}

func (p *ProductServiceImpl) CreateProduct(product models.CreateProductDTO) (*index.Response, error) {
	return p.productRepo.CreateProduct(product)
}

func (p *ProductServiceImpl) GetProductById(id string) *get.Response {
	return p.productRepo.GetProductById(id)
}

func (p *ProductServiceImpl) UpdateProduct(product models.UpdateProductDTO) error {
	return p.productRepo.UpdateProduct(product)
}

func (p *ProductServiceImpl) DeleteProduct(id string) error {
	return p.productRepo.DeleteProduct(id)
}

func (p *ProductServiceImpl) SearchProducts(query string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error) {
	return p.productRepo.SearchProducts(query, minRating, minPrice, maxPrice, sortBy, limit, page)
}

func (p *ProductServiceImpl) GetProducts(genre string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error) {
	return p.productRepo.GetProducts(genre, minRating, minPrice, maxPrice, sortBy, limit, page)
}

func (p *ProductServiceImpl) UpdateSoldAndRating(product models.ReceiveUpdateSoldAndAvgRatingDTO) error {
	return p.productRepo.UpdateSoldAndRating(product)
}

func (p *ProductServiceImpl) UpdateProductGenre(genre models.UpdateProductGenreDTO) error {
	return p.productRepo.UpdateProductGenre(genre)
}
