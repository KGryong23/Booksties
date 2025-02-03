package repositories

import (
	"InventoryService/internal/models"
	"InventoryService/internal/query"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const dbTimeout = 3 * time.Second

type InventoryRepository interface {
	AddInventory(tx *sql.Tx, inventory models.AddOrUpdateInventoryDto) (uuid.UUID, error)
	UpdateInventory(inventory models.AddOrUpdateInventoryDto) error
	UpdateInventoryTx(tx *sql.Tx, inventory models.AddOrUpdateInventoryDto) error
	UpdateInventoryList(tx *sql.Tx, inventoryList []models.AddOrUpdateInventoryDto) error
	DeleteInventory(id uuid.UUID) error
	DeleteInventoryByProdID(productID uuid.UUID) error
	AddInventoryTransaction(tx *sql.Tx, inventory models.AddInventoryTransactionDto) error
	AddInventoryTransactionList(tx *sql.Tx, inventoryList []models.AddInventoryTransactionDto) error
	UpdateInventoryTransaction(inventory models.UpdateInventoryTransactionDto) error
	DeleteInventoryTransaction(id uuid.UUID) error
	GetInventoryByProdID(id uuid.UUID) (models.GetInventoryDto, error)
	GetInventoryList(ids []uuid.UUID) ([]models.GetInventoryDto, error)
	GetTransactionByInventory(id uuid.UUID) ([]models.GetTransactionDto, error)
}

type InventoryRepositoryImpl struct {
	db *sql.DB
}

func NewInventoryRepository(db *sql.DB) InventoryRepository {
	return &InventoryRepositoryImpl{
		db: db,
	}
}

func (i *InventoryRepositoryImpl) AddInventory(tx *sql.Tx, inventory models.AddOrUpdateInventoryDto) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	id := uuid.New()
	_, err := tx.ExecContext(
		ctx,
		query.CREATE_INVENTORY,
		id,
		inventory.ProductID,
		inventory.Quantity,
	)

	return id, err
}

func (i *InventoryRepositoryImpl) UpdateInventory(inventory models.AddOrUpdateInventoryDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := i.db.BeginTx(ctx, nil)
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
		query.UPDATE_INVENTORY,
		inventory.ProductID,
		inventory.Quantity,
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

func (i *InventoryRepositoryImpl) UpdateInventoryList(tx *sql.Tx, inventoryList []models.AddOrUpdateInventoryDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	itemsJSON, err := json.Marshal(inventoryList)
	if err != nil {
		return fmt.Errorf("failed to marshal inventory items: %w", err)
	}
	_, err = tx.ExecContext(ctx, query.UPDATE_INVENTORY_LIST, string(itemsJSON))

	if err != nil {
		return err
	}

	return err
}

func (i *InventoryRepositoryImpl) DeleteInventory(id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := i.db.BeginTx(ctx, nil)
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
		query.DELETE_INVENTORY,
		id,
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

func (i *InventoryRepositoryImpl) DeleteInventoryByProdID(productID uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := i.db.BeginTx(ctx, nil)
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
		query.DELETE_INVENTORY_PROD_ID,
		productID,
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

func (i *InventoryRepositoryImpl) AddInventoryTransaction(tx *sql.Tx, inventory models.AddInventoryTransactionDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := tx.ExecContext(
		ctx,
		query.CREATE_INVENTORY_TRANSACTIONS,
		inventory.InventoryID,
		inventory.TransactionType,
		inventory.Quantity,
		inventory.Reason,
	)

	return err
}

func (i *InventoryRepositoryImpl) AddInventoryTransactionList(tx *sql.Tx, inventoryList []models.AddInventoryTransactionDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	itemsJSON, err := json.Marshal(inventoryList)
	if err != nil {
		return fmt.Errorf("failed to marshal inventory items: %w", err)
	}

	_, err = tx.ExecContext(ctx, query.CREATE_INVENTORY_TRANSACTIONS_LIST, string(itemsJSON))
	if err != nil {
		return err
	}

	return err
}

func (i *InventoryRepositoryImpl) UpdateInventoryTransaction(inventory models.UpdateInventoryTransactionDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := i.db.BeginTx(ctx, nil)
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
		query.UPDATE_INVENTORY_TRANSACTIONS,
		inventory.TransactionID,
		inventory.TransactionType,
		inventory.Quantity,
		inventory.Reason,
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

func (i *InventoryRepositoryImpl) DeleteInventoryTransaction(id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := i.db.BeginTx(ctx, nil)
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
		query.DELETE_INVENTORY_TRANSACTIONS,
		id,
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

func (i *InventoryRepositoryImpl) GetInventoryByProdID(id uuid.UUID) (models.GetInventoryDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var inventory models.GetInventoryDto
	err := i.db.QueryRowContext(ctx, query.GET_INVENTORY, id).Scan(
		&inventory.InventoryID,
		&inventory.ProductID,
		&inventory.Quantity,
	)
	if err != nil {
		return inventory, err
	}
	return inventory, nil
}

func (i *InventoryRepositoryImpl) GetInventoryList(ids []uuid.UUID) ([]models.GetInventoryDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var inventoryList []models.GetInventoryDto
	for _, id := range ids {
		var inventory models.GetInventoryDto
		err := i.db.QueryRowContext(ctx, query.GET_INVENTORY, id).Scan(
			&inventory.InventoryID,
			&inventory.ProductID,
			&inventory.Quantity,
		)
		if err != nil {
			return inventoryList, err
		}
		inventoryList = append(inventoryList, inventory)
	}
	return inventoryList, nil
}

func (i *InventoryRepositoryImpl) UpdateInventoryTx(tx *sql.Tx, inventory models.AddOrUpdateInventoryDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := tx.ExecContext(
		ctx,
		query.UPDATE_INVENTORY,
		inventory.ProductID,
		inventory.Quantity,
	)

	return err
}

func (i *InventoryRepositoryImpl) GetTransactionByInventory(id uuid.UUID) ([]models.GetTransactionDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := i.db.QueryContext(ctx, query.GET_TRANSACTIONS, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []models.GetTransactionDto
	for rows.Next() {
		var dto models.GetTransactionDto
		if err := rows.Scan(&dto.TransactionID, &dto.TransactionType, &dto.Quantity, &dto.Reason, &dto.CreatedAt); err != nil {
			return nil, err
		}
		transactions = append(transactions, dto)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
