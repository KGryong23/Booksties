package unitofwork

import (
	"CatalogService/internal/models"
	"CatalogService/internal/repositories"
	"context"
	"database/sql"

	"github.com/google/uuid"
)

type Unitofwork interface {
	CreateProductAndProductGenres(product *models.CreateProductDTO) (uuid.UUID, error)
}

type UnitofworkImpl struct {
	productRepo        repositories.ProductRepository
	genreRepo          repositories.GenreRepository
	transactionManager *TransactionManager
}

func NewUnitOfWork(
	productRepo repositories.ProductRepository,
	genreRepo repositories.GenreRepository,
	transactionManager *TransactionManager,
) Unitofwork {
	return &UnitofworkImpl{
		productRepo:        productRepo,
		genreRepo:          genreRepo,
		transactionManager: transactionManager,
	}
}

func (u *UnitofworkImpl) CreateProductAndProductGenres(product *models.CreateProductDTO) (uuid.UUID, error) {
	var productId uuid.UUID
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		var err error
		productId, err = u.productRepo.CreateProduct(tx, product)
		if err != nil {
			return err
		}
		err = u.genreRepo.CreateGenres(tx, productId, product.GenreIDs)
		if err != nil {
			return err
		}
		return err
	})
	if err != nil {
		return uuid.Nil, err
	}
	return productId, nil
}
