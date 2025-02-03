package server

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"InventoryService/internal/database"
	protos "InventoryService/internal/protos/pd"
	"InventoryService/internal/repositories"
	"InventoryService/internal/services"
	"InventoryService/internal/unitofwork"
)

type Server struct {
	port             int
	grpcPort         int
	db               database.Service
	rabbitConn       *amqp091.Connection
	inventoryService services.InventoryService
	unitofwork       unitofwork.Unitofwork
	grpcServer       *grpc.Server
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	grpcPort, _ := strconv.Atoi(os.Getenv("GRPC_PORT"))
	db := database.New()

	rabbitConn, err := connectRabbitMqWithRetry()
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
		return nil
	}

	txManager := unitofwork.NewTransactionManager(db.DB())
	inventoryRepo := repositories.NewInventoryRepository(db.DB())
	inventoryService := services.NewInventoryService(inventoryRepo)
	NewServer := &Server{
		port:             port,
		db:               db,
		grpcPort:         grpcPort,
		inventoryService: inventoryService,
		unitofwork: unitofwork.NewUnitOfWork(
			inventoryRepo,
			txManager,
		),
		rabbitConn: rabbitConn,
		grpcServer: grpc.NewServer(),
	}

	err = NewServer.setupRabbitMQListener()
	if err != nil {
		log.Fatalf("Failed to setup RabbitMQ listener: %v", err)
		return nil
	}

	protos.RegisterInventoryServiceServer(NewServer.grpcServer, &InventoryGrpcServerHandler{
		inventoryService: inventoryService,
	})
	reflection.Register(NewServer.grpcServer)

	go NewServer.startGrpcServer()

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}

func connectRabbitMqWithRetry() (*amqp091.Connection, error) {
	var rabbitConn *amqp091.Connection
	var err error

	maxRetries := 5
	retryDelay := time.Second * 5
	for i := 0; i < maxRetries; i++ {
		rabbitConn, err = amqp091.Dial(os.Getenv("RABBITMQ_URL"))

		if err == nil {
			log.Printf("Successfully connected to RabbitMq on attempt %d\n", i+1)
			return rabbitConn, nil
		}

		log.Printf("Failed to connect to RabbitMq, retrying... (%d/%d)", i+1, maxRetries)
		time.Sleep(retryDelay)
	}

	return nil, err
}

func (s *Server) startGrpcServer() {
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", s.grpcPort))
	if err != nil {
		log.Fatalf("Failed to listen on gRPC port: %v", err)
	}

	log.Printf("gRPC server is running on port %d", s.grpcPort)
	if err := s.grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to start gRPC server: %v", err)
	}
}
