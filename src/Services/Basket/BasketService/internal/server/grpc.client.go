package server

import (
	protos "BasketService/internal/protos/pd"
	"context"
	"log"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func (s *Server) HandleGetProductsFromCatalog(productIds []string) (*protos.ProductBasketList, error) {
	grpcServerHost := os.Getenv("GRPC_SERVER_HOST")
	if grpcServerHost == "" {
		log.Fatalf("Environment variable GRPC_SERVER_HOST is not set")
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
	resp, err := client.GetProductsSendBasket(
		context.Background(),
		&protos.ProductIdsRequest{ProductIds: productIds},
	)
	if err != nil {
		return nil, err
	}
	log.Println("Get products from catalog succeed")
	return resp, nil
}
