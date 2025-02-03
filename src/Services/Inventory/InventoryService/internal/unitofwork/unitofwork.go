package unitofwork

import (
	"InventoryService/internal/models"
	"InventoryService/internal/repositories"
	"context"
	"database/sql"

	"github.com/google/uuid"
)

type Unitofwork interface {
	CreateInventoryAndInventoryTransaction(inventory models.AddOrUpdateInventoryDto) (uuid.UUID, error)
	UpdateInventoryAndCreateInventoryTransaction(inventoryTrans []models.UpdateInventoryAndCreateInventoryTransactionDto) error
	handleInventory(inventoryTrans []models.UpdateInventoryAndCreateInventoryTransactionDto) ([]models.AddOrUpdateInventoryDto, []models.AddInventoryTransactionDto, error)
	UpdateInventoryAndAddTransaction(inventoryTrans models.UpdateInventoryAndCreateInventoryTransactionDto) error
}

type UnitofworkImpl struct {
	inventoryRepo      repositories.InventoryRepository
	transactionManager *TransactionManager
}

func NewUnitOfWork(inventoryRepo repositories.InventoryRepository, transactionManager *TransactionManager) Unitofwork {
	return &UnitofworkImpl{
		inventoryRepo:      inventoryRepo,
		transactionManager: transactionManager,
	}
}

func (u *UnitofworkImpl) UpdateInventoryAndAddTransaction(inventoryTrans models.UpdateInventoryAndCreateInventoryTransactionDto) error {
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		data, err := u.inventoryRepo.GetInventoryByProdID(inventoryTrans.ProductID)
		if err != nil {
			return err
		}
		inventory := models.AddOrUpdateInventoryDto{
			ProductID: data.ProductID,
		}
		inventoryTransaction := models.AddInventoryTransactionDto{
			InventoryID:     data.InventoryID,
			TransactionType: inventoryTrans.TransactionType,
			Quantity:        inventoryTrans.Quantity,
			Reason:          inventoryTrans.Reason,
		}
		if inventoryTrans.TransactionType == "IN" {
			inventory.Quantity = data.Quantity + inventoryTrans.Quantity
		} else if inventoryTrans.TransactionType == "OUT" {
			inventory.Quantity = data.Quantity - inventoryTrans.Quantity
		}
		err = u.inventoryRepo.UpdateInventoryTx(tx, inventory)
		if err != nil {
			return err
		}
		err = u.inventoryRepo.AddInventoryTransaction(tx, inventoryTransaction)
		return err
	})
	return err
}

func (u *UnitofworkImpl) CreateInventoryAndInventoryTransaction(inventory models.AddOrUpdateInventoryDto) (uuid.UUID, error) {
	var inventoryId uuid.UUID
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		var err error
		inventoryId, err = u.inventoryRepo.AddInventory(tx, inventory)
		if err != nil {
			return err
		}
		invetoryTransaction := models.AddInventoryTransactionDto{
			InventoryID:     inventoryId,
			TransactionType: "IN",
			Quantity:        inventory.Quantity,
			Reason:          "Khởi tạo kho",
		}
		err = u.inventoryRepo.AddInventoryTransaction(tx, invetoryTransaction)
		return err
	})
	return inventoryId, err
}

func (u *UnitofworkImpl) UpdateInventoryAndCreateInventoryTransaction(inventoryTrans []models.UpdateInventoryAndCreateInventoryTransactionDto) error {
	err := u.transactionManager.ExecuteInTransaction(context.Background(), func(tx *sql.Tx) error {
		inventory, inventoryTransList, err := u.handleInventory(inventoryTrans)
		if err != nil {
			return err
		}
		err = u.inventoryRepo.UpdateInventoryList(tx, inventory)
		if err != nil {
			return err
		}
		err = u.inventoryRepo.AddInventoryTransactionList(tx, inventoryTransList)
		if err != nil {
			return err
		}
		return err
	})
	return err
}

func (u *UnitofworkImpl) handleInventory(
	inventoryTrans []models.UpdateInventoryAndCreateInventoryTransactionDto,
) ([]models.AddOrUpdateInventoryDto, []models.AddInventoryTransactionDto, error) {
	var inventoryList []models.AddOrUpdateInventoryDto
	var inventoryTransactionList []models.AddInventoryTransactionDto
	for _, item := range inventoryTrans {
		data, err := u.inventoryRepo.GetInventoryByProdID(item.ProductID)
		if err != nil {
			return inventoryList, inventoryTransactionList, err
		}
		inventory := models.AddOrUpdateInventoryDto{
			ProductID: data.ProductID,
		}
		inventoryTransaction := models.AddInventoryTransactionDto{
			InventoryID:     data.InventoryID,
			TransactionType: item.TransactionType,
			Quantity:        item.Quantity,
			Reason:          item.Reason,
		}
		if item.TransactionType == "IN" {
			inventory.Quantity = data.Quantity + item.Quantity
		} else if item.TransactionType == "OUT" {
			inventory.Quantity = data.Quantity - item.Quantity
		}
		inventoryList = append(inventoryList, inventory)
		inventoryTransactionList = append(inventoryTransactionList, inventoryTransaction)
	}
	return inventoryList, inventoryTransactionList, nil
}
