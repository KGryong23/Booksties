package unitofwork

import (
	"BasketService/internal/models"
	"BasketService/internal/repositories"
	"context"
	"database/sql"

	"github.com/google/uuid"
)

type Unitofwork interface {
	CreateBasketAndBasketItem(basket *models.CreateBasketItemDto) error
}

type UnitofworkImpl struct {
	basketRepo         repositories.BasketRepository
	transactionManager *TransactionManager
}

func NewUnitOfWork(
	basketRepo repositories.BasketRepository,
	transactionManager *TransactionManager) Unitofwork {
	return &UnitofworkImpl{
		basketRepo:         basketRepo,
		transactionManager: transactionManager,
	}
}

func (u *UnitofworkImpl) CreateBasketAndBasketItem(basket *models.CreateBasketItemDto) error {
	var basketId uuid.UUID
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		var err error
		basketId, err = u.basketRepo.AddOrUpdateBasket(tx, basket.UserID)
		if err != nil {
			return err
		}
		err = u.basketRepo.AddOrUpdateBasketItem(tx, basketId, basket.ProductID, basket.Quantity)
		if err != nil {
			return err
		}
		return err
	})
	if err != nil {
		return err
	}
	return nil
}
