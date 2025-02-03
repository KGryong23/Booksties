package models

import (
	"time"

	"github.com/google/uuid"
)

type AddOrUpdateInventoryDto struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type AddInventoryTransactionDto struct {
	InventoryID     uuid.UUID `json:"inventory_id"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	Reason          string    `json:"reason"`
}

type UpdateInventoryTransactionDto struct {
	TransactionID   uuid.UUID `json:"transaction_id"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	Reason          string    `json:"reason"`
}

type UpdateInventoryAndCreateInventoryTransactionDto struct {
	ProductID       uuid.UUID `json:"product_id"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	Reason          string    `json:"reason"`
}

type GetInventoryDto struct {
	InventoryID uuid.UUID `json:"inventory_id"`
	ProductID   uuid.UUID `json:"product_id"`
	Quantity    int       `json:"quantity"`
}

type DeleteInventoryByProdIDDto struct {
	ProductID uuid.UUID `json:"product_id"`
}

type GetTransactionDto struct {
	TransactionID   uuid.UUID `json:"transaction_id"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	Reason          string    `json:"reason"`
	CreatedAt       time.Time `json:"created_at"`
}
