package repositories

import (
	"CatalogService/internal/models"
	"CatalogService/internal/query"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const dbTimeout = 3 * time.Second

type ProductRepository interface {
	GetProductById(id uuid.UUID) (*models.Product, error)
	GetListProducts(field string, order string, page int, limit int, rating float64, genre_id *uuid.UUID, search_term *string) (*[]models.Product, error)
	GetProductToUpdate(productID uuid.UUID) (*models.SendUpdateSoldAndAvgRatingDTO, error)
	CreateProduct(tx *sql.Tx, product *models.CreateProductDTO) (uuid.UUID, error)
	UpdateProduct(product *models.UpdateProductDTO) error
	UpdateSoldQuantity(products []models.ReceiveSoldDto) error
	UpdateReview(product *models.ReceiveReviewDto) error
	DeleteProduct(id uuid.UUID) error
	GetProductInBasketItem(productIDs []string) (*[]models.GetProductInBasketItemsDto, error)
	GetProductInOrderItem(productIDs []string) (*[]models.GetProductInOrderItemsDto, error)
	GetProductsTop() ([]models.ProductTopDTO, error)
	GetAllTitle() ([]models.TileDto, error)
}

type ProductRepositoryImpl struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) ProductRepository {
	return &ProductRepositoryImpl{
		db: db,
	}
}

func (p *ProductRepositoryImpl) GetProductById(id uuid.UUID) (*models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var product models.Product
	var imageURL *string
	err := p.db.QueryRowContext(ctx, query.GET_PRODUCT_BY_ID, id).Scan(
		&product.ID, &product.Title, &product.Author,
		&product.Publisher, &product.PublicationYear,
		&product.PageCount, &product.Dimensions,
		&product.CoverType, &product.Price, &product.Description,
		&imageURL, &product.SoldQuantity, &product.AverageRating,
		&product.QuantityEvaluate, &product.DiscountPercentage, &product.ProductType,
		&product.IsActive, &product.OriginalOwnerID, &product.CreatedAt,
		&product.UpdatedAt,
	)

	if imageURL != nil {
		product.ImageURL = *imageURL
	} else {
		product.ImageURL = ""
	}
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (p *ProductRepositoryImpl) CreateProduct(tx *sql.Tx, product *models.CreateProductDTO) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	id := uuid.New()
	_, err := tx.ExecContext(ctx, query.CREATE_PRODUCT, id,
		product.Title, product.Author, product.Publisher,
		product.PublicationYear, product.PageCount,
		product.Dimensions, product.CoverType,
		product.Price, product.Description,
		product.ImageURL, product.ProductType, product.IsActive,
		product.OriginalOwnerID,
	)
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}

func (p *ProductRepositoryImpl) UpdateProduct(product *models.UpdateProductDTO) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := p.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.UPDATE_PRODUCT,
		product.ID, product.Title, product.Author, product.Publisher,
		product.PublicationYear, product.PageCount, product.Dimensions, product.CoverType,
		product.Price, product.Description, product.ImageURL, product.DiscountPercentage,
		product.ProductType, product.IsActive,
	)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) DeleteProduct(id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := p.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.DELETE_PRODUCT, id)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) GetListProducts(field string, order string, page int, limit int, rating float64, genre_id *uuid.UUID, search_term *string) (*[]models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := p.db.QueryContext(ctx, query.PAGINATION_PRODUCT,
		field,
		order,
		page,
		limit,
		rating,
		genre_id,
		search_term,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var products []models.Product
	for rows.Next() {
		var product models.Product
		err := rows.Scan(
			&product.ID, &product.Title, &product.Author,
			&product.Publisher, &product.PublicationYear,
			&product.PageCount, &product.Dimensions,
			&product.CoverType, &product.Price, &product.Description,
			&product.ImageURL, &product.SoldQuantity, &product.AverageRating,
			&product.QuantityEvaluate, &product.DiscountPercentage, &product.ProductType,
			&product.IsActive, &product.OriginalOwnerID, &product.CreatedAt,
			&product.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}
	return &products, nil
}

func (p *ProductRepositoryImpl) GetProductInBasketItem(productIDs []string) (*[]models.GetProductInBasketItemsDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := p.db.QueryContext(ctx, query.GET_GRPC_PRODUCTS_BASKET, productIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var products []models.GetProductInBasketItemsDto
	for rows.Next() {
		var product models.GetProductInBasketItemsDto
		err := rows.Scan(
			&product.ID,
			&product.Title,
			&product.Author,
			&product.Price,
			&product.DiscountPercentage,
			&product.ImageURL,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}
	return &products, nil
}

func (p *ProductRepositoryImpl) GetProductInOrderItem(productIDs []string) (*[]models.GetProductInOrderItemsDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := p.db.QueryContext(ctx, query.GET_GRPC_PRODUCTS_ORDER, productIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var products []models.GetProductInOrderItemsDto
	for rows.Next() {
		var product models.GetProductInOrderItemsDto
		err := rows.Scan(
			&product.ID,
			&product.Title,
			&product.Author,
			&product.ImageURL,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}
	return &products, nil
}

func (p *ProductRepositoryImpl) UpdateSoldQuantity(product []models.ReceiveSoldDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := p.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	itemsJSON, err := json.Marshal(product)
	if err != nil {
		return fmt.Errorf("failed to marshal order items: %w", err)
	}
	_, err = tx.ExecContext(ctx, query.UPDATE_SOLD, string(itemsJSON))

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) UpdateReview(product *models.ReceiveReviewDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := p.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(
		ctx,
		query.UPDATE_REVIEW,
		product.ProductID,
		product.AverageRating,
		product.QuantityEvaluate,
	)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) GetProductToUpdate(productID uuid.UUID) (*models.SendUpdateSoldAndAvgRatingDTO, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var product models.SendUpdateSoldAndAvgRatingDTO
	err := p.db.QueryRowContext(ctx, query.GET_PRODUCT_TO_UPDATE, productID).Scan(
		&product.ID,
		&product.SoldQuantity,
		&product.AverageRating,
	)
	if err != nil {
		return nil, err
	}
	return &product, err
}

func (p *ProductRepositoryImpl) GetProductsTop() ([]models.ProductTopDTO, error) {
	rows, err := p.db.Query(query.GET_BOOKS_TOP)
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}
	defer rows.Close()

	var products []models.ProductTopDTO
	for rows.Next() {
		var product models.ProductTopDTO
		if err := rows.Scan(&product.ID, &product.Title, &product.SoldQuantity, &product.AverageRating); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		products = append(products, product)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration failed: %w", err)
	}

	return products, nil
}

func (p *ProductRepositoryImpl) GetAllTitle() ([]models.TileDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := p.db.QueryContext(ctx, query.GET_TITLE)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var titles []models.TileDto
	for rows.Next() {
		var title models.TileDto
		err := rows.Scan(
			&title.Title,
		)
		if err != nil {
			return nil, err
		}
		titles = append(titles, title)
	}
	return titles, nil
}
