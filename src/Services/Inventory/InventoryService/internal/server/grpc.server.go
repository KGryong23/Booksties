package server

import (
	protos "InventoryService/internal/protos/pd"
	"InventoryService/internal/services"
	"context"

	"github.com/google/uuid"
)

type InventoryGrpcServerHandler struct {
	protos.UnimplementedInventoryServiceServer
	inventoryService services.InventoryService
}

func (i *InventoryGrpcServerHandler) CheckStock(ctx context.Context, req *protos.CheckStockRequest) (*protos.CheckStockResponse, error) {
	var insufficientStockProductIds []string

	for _, product := range req.Products {
		if check, _ := i.inventoryService.CheckStock(uuid.MustParse(product.ProductId), int(product.Quantity)); !check {
			insufficientStockProductIds = append(insufficientStockProductIds, product.ProductId)
		}
	}

	return &protos.CheckStockResponse{
		InsufficientStockProductIds: insufficientStockProductIds,
	}, nil
}
