package server

import (
	protos "CatalogService/internal/protos/pd"
	"CatalogService/internal/services"
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type CatalogGrpcServerHandler struct {
	protos.UnimplementedCatalogServiceServer
	productService services.ProductService
}

func (c *CatalogGrpcServerHandler) GetProductsSendBasket(ctx context.Context, req *protos.ProductIdsRequest) (*protos.ProductBasketList, error) {
	productIDs := req.ProductIds

	products, err := c.productService.GetProductInBasketItem(productIDs)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to fetch products: %v", err)
	}

	var productList []*protos.ProductBasket
	for _, product := range *products {
		var imageURL string
		if product.ImageURL != nil {
			imageURL = *product.ImageURL
		}
		productList = append(productList, &protos.ProductBasket{
			Id:                 product.ID.String(),
			Title:              product.Title,
			Author:             product.Author,
			DiscountPercentage: int64(product.DiscountPercentage),
			ImageUrl:           imageURL,
			Price:              float32(product.Price),
		})
	}

	return &protos.ProductBasketList{Products: productList}, nil
}

func (c *CatalogGrpcServerHandler) GetProductsSendOrder(ctx context.Context, req *protos.ProductIdsRequest) (*protos.ProductOrderList, error) {
	productIDs := req.ProductIds

	products, err := c.productService.GetProductInOrderItem(productIDs)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to fetch products: %v", err)
	}

	var productList []*protos.ProductOrder
	for _, product := range *products {
		var imageURL string
		if product.ImageURL != nil {
			imageURL = *product.ImageURL
		}
		productList = append(productList, &protos.ProductOrder{
			Id:       product.ID.String(),
			Title:    product.Title,
			Author:   product.Author,
			ImageUrl: imageURL,
		})
	}

	return &protos.ProductOrderList{Products: productList}, nil
}
