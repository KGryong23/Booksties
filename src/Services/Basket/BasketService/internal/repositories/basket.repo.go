package repositories

import (
	"BasketService/internal/models"
	"BasketService/internal/query"
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const dbTimeout = 3 * time.Second

type BasketRepository interface {
	AddOrUpdateBasket(tx *sql.Tx, userid uuid.UUID) (uuid.UUID, error)
	AddOrUpdateBasketItem(tx *sql.Tx, basketId uuid.UUID, productId uuid.UUID, quantity int) error
	RemoveBasketItem(basketItem *models.RemoveBasketItemDto) error
	ClearBasketByUserId(userId uuid.UUID) error
	UpdateBasketItemQuantity(basketItem *models.UpdateBasketItemQuantityDto) error
	GetBasketItemsByUserId(userId uuid.UUID) (*[]models.GetBasketItemsDto, error)
}

type BasketRepositoryImpl struct {
	db *sql.DB
}

func NewBasketRepository(db *sql.DB) BasketRepository {
	return &BasketRepositoryImpl{
		db: db,
	}
}

func (b *BasketRepositoryImpl) AddOrUpdateBasket(tx *sql.Tx, userid uuid.UUID) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var basketId uuid.UUID
	err := tx.QueryRowContext(ctx, query.AddOrUpdateBasket, userid).Scan(&basketId)
	if err != nil {
		fmt.Println(err.Error())
		return uuid.Nil, err
	}
	return basketId, nil
}

func (b *BasketRepositoryImpl) AddOrUpdateBasketItem(tx *sql.Tx, basketId uuid.UUID, productId uuid.UUID, quantity int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := tx.ExecContext(ctx, query.AddOrUpdateBasketItem, basketId, productId, quantity)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	return nil
}

func (b *BasketRepositoryImpl) RemoveBasketItem(basketItem *models.RemoveBasketItemDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := b.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	_, err = tx.ExecContext(ctx, query.RemoveBasketItem, basketItem.UserID, basketItem.ProductID)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (b *BasketRepositoryImpl) ClearBasketByUserId(userId uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := b.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	_, err = tx.ExecContext(ctx, query.ClearBasketByUserId, userId)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (b *BasketRepositoryImpl) UpdateBasketItemQuantity(basketItem *models.UpdateBasketItemQuantityDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := b.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	_, err = tx.ExecContext(ctx, query.UpdateBasketItemQuantity, basketItem.UserID, basketItem.ProductID, basketItem.Quantity)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (b *BasketRepositoryImpl) GetBasketItemsByUserId(userId uuid.UUID) (*[]models.GetBasketItemsDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := b.db.QueryContext(ctx, query.GetBasketItemByUserID, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var basketItems []models.GetBasketItemsDto
	for rows.Next() {
		var basketItem models.GetBasketItemsDto
		err := rows.Scan(
			&basketItem.ProductID,
			&basketItem.Quantity,
		)
		if err != nil {
			return nil, err
		}
		basketItems = append(basketItems, basketItem)
	}
	return &basketItems, nil
}
