package models

import "github.com/google/uuid"

func MapperToIDs(data []UpdateInventoryAndCreateInventoryTransactionDto) []uuid.UUID {
	var ids []uuid.UUID
	for _, item := range data {
		ids = append(ids, item.ProductID)
	}
	return ids
}
