package services

import (
	"InventoryService/internal/models"
	"InventoryService/internal/repositories"

	"github.com/google/uuid"
)

type InventoryService interface {
	UpdateInventory(inventory models.AddOrUpdateInventoryDto) error
	DeleteInventory(id uuid.UUID) error
	DeleteInventoryByProdID(productID uuid.UUID) error
	UpdateInventoryTransaction(inventory models.UpdateInventoryTransactionDto) error
	DeleteInventoryTransaction(id uuid.UUID) error
	CheckStock(id uuid.UUID, numberCheck int) (bool, error)
	GetTransactionByInventory(id uuid.UUID) ([]models.GetTransactionDto, error)
	GetInventoryByProdID(id uuid.UUID) (models.GetInventoryDto, error)
}

type InventoryServiceImpl struct {
	inventoryRepo repositories.InventoryRepository
}

func NewInventoryService(inventoryRepo repositories.InventoryRepository) InventoryService {
	return &InventoryServiceImpl{
		inventoryRepo: inventoryRepo,
	}
}

func (i *InventoryServiceImpl) UpdateInventory(inventory models.AddOrUpdateInventoryDto) error {
	return i.inventoryRepo.UpdateInventory(inventory)
}

func (i *InventoryServiceImpl) DeleteInventory(id uuid.UUID) error {
	return i.inventoryRepo.DeleteInventory(id)
}

func (i *InventoryServiceImpl) UpdateInventoryTransaction(inventory models.UpdateInventoryTransactionDto) error {
	return i.inventoryRepo.UpdateInventoryTransaction(inventory)
}

func (i *InventoryServiceImpl) DeleteInventoryTransaction(id uuid.UUID) error {
	return i.inventoryRepo.DeleteInventoryTransaction(id)
}

func (i *InventoryServiceImpl) CheckStock(id uuid.UUID, numberCheck int) (bool, error) {
	invetory, err := i.inventoryRepo.GetInventoryByProdID(id)
	if err != nil {
		return false, err
	}
	if invetory.Quantity <= numberCheck {
		return false, err
	}
	return true, err
}

func (i *InventoryServiceImpl) DeleteInventoryByProdID(productID uuid.UUID) error {
	return i.inventoryRepo.DeleteInventoryByProdID(productID)
}

func (i *InventoryServiceImpl) GetTransactionByInventory(id uuid.UUID) ([]models.GetTransactionDto, error) {
	return i.inventoryRepo.GetTransactionByInventory(id)
}

func (i *InventoryServiceImpl) GetInventoryByProdID(id uuid.UUID) (models.GetInventoryDto, error) {
	return i.inventoryRepo.GetInventoryByProdID(id)
}
