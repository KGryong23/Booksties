package server

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rabbitmq/amqp091-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"CatalogService/internal/database"
	protos "CatalogService/internal/protos/pd"
	"CatalogService/internal/repositories"
	"CatalogService/internal/services"
	"CatalogService/internal/unitofwork"
)

type Server struct {
	port           int
	grpcPort       int
	db             database.Service
	productService services.ProductService
	genreService   services.GenreService
	unitofwork     unitofwork.Unitofwork
	rabbitConn     *amqp091.Connection
	channelPool    sync.Pool
	grpcServer     *grpc.Server
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
	productRepo := repositories.NewProductRepository(db.DB())
	genreRepo := repositories.NewGenreRepository(db.DB())
	productService := services.NewProductService(productRepo)

	NewServer := &Server{
		port:           port,
		grpcPort:       grpcPort,
		db:             db,
		rabbitConn:     rabbitConn,
		productService: productService,
		genreService: services.NewGenreService(
			genreRepo,
		),
		unitofwork: unitofwork.NewUnitOfWork(
			productRepo,
			genreRepo,
			txManager,
		),
		grpcServer: grpc.NewServer(),
	}

	NewServer.InitChannelPool()

	err = NewServer.setupRabbitMQListener()
	if err != nil {
		log.Fatalf("Failed to setup RabbitMQ listener: %v", err)
		return nil
	}

	protos.RegisterCatalogServiceServer(NewServer.grpcServer, &CatalogGrpcServerHandler{
		productService: productService,
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

func (s *Server) InitChannelPool() {
	s.channelPool = sync.Pool{
		New: func() interface{} {
			channel, err := s.rabbitConn.Channel()
			if err != nil {
				log.Fatalf("Failed to open a channel: %v", err)
			}
			return channel
		},
	}
}

func (s *Server) getChannel() *amqp091.Channel {
	channel := s.channelPool.Get().(*amqp091.Channel)
	if channel.IsClosed() {
		log.Println("Channel is closed, creating a new one")
		newChannel, err := s.rabbitConn.Channel()
		if err != nil {
			log.Fatalf("Failed to open a new channel: %v", err)
		}
		return newChannel
	}
	return channel
}

func (s *Server) releaseChannel(channel *amqp091.Channel) {
	if channel.IsClosed() {
		log.Println("Channel is closed, discarding it")
		return
	}
	s.channelPool.Put(channel)
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
