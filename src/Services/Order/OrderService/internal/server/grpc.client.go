package server

import (
	protos "OrderService/internal/protos/pd"
	"context"
	"log"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func (s *Server) HandleGetProductsFromCatalog(productIds []string) (*protos.ProductOrderList, error) {
	grpcServerHost := os.Getenv("GRPC_SERVER_HOST_CATALOG")
	if grpcServerHost == "" {
		log.Fatalf("Environment variable GRPC_SERVER_HOST_CATALOG is not set")
	}

	conn, err := grpc.Dial(
		grpcServerHost,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("failed to connect to gRPC server: %v", err)
	}
	defer conn.Close()

	client := protos.NewCatalogServiceClient(conn)
	resp, err := client.GetProductsSendOrder(
		context.Background(),
		&protos.ProductIdsRequest{ProductIds: productIds},
	)
	if err != nil {
		return nil, err
	}
	log.Println("Get products from catalog succeed")
	return resp, nil
}

func (s *Server) HandleCheckFromStock(products []*protos.ProductQuantity) (*protos.CheckStockResponse, error) {
	grpcServerHost := os.Getenv("GRPC_SERVER_HOST_INVENTORY")
	if grpcServerHost == "" {
		log.Fatalf("Environment variable GRPC_SERVER_HOST_INVENTORY is not set")
	}

	conn, err := grpc.Dial(
		grpcServerHost,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("failed to connect to gRPC server: %v", err)
	}
	defer conn.Close()

	client := protos.NewInventoryServiceClient(conn)
	resp, err := client.CheckStock(
		context.Background(),
		&protos.CheckStockRequest{Products: products},
	)
	if err != nil {
		return nil, err
	}
	log.Println("Get products from catalog succeed")
	return resp, nil
}
