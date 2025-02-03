package unitofwork

import (
	"OrderService/internal/models"
	"OrderService/internal/repositories"
	"context"
	"database/sql"

	"github.com/google/uuid"
)

type Unitofwork interface {
	CreateOrderAndOrderItems(orderitems *models.CreateOrderAndOrderItemDto) (uuid.UUID, error)
}

type UnitofworkImpl struct {
	orderRepo          repositories.OrderRepository
	transactionManager *TransactionManager
}

func NewUnitOfWork(
	orderRepo repositories.OrderRepository,
	transactionManager *TransactionManager,
) Unitofwork {
	return &UnitofworkImpl{
		orderRepo:          orderRepo,
		transactionManager: transactionManager,
	}
}

func (u *UnitofworkImpl) CreateOrderAndOrderItems(orderitems *models.CreateOrderAndOrderItemDto) (uuid.UUID, error) {
	var orderid uuid.UUID
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		var err error
		orderid, err = u.orderRepo.CreateOrder(tx, &orderitems.CreateOrderDto)
		if err != nil {
			return err
		}
		err = u.orderRepo.CreateOrderItems(tx, orderid, orderitems.OrderItems)
		if err != nil {
			return err
		}
		return err
	})
	if err != nil {
		return uuid.Nil, err
	}
	return orderid, nil
}
