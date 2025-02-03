package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rabbitmq/amqp091-go"

	"OrderService/internal/database"
	"OrderService/internal/repositories"
	"OrderService/internal/services"
	"OrderService/internal/unitofwork"
)

type Server struct {
	port         int
	db           database.Service
	orderService services.OrderService
	unitofwork   unitofwork.Unitofwork
	rabbitConn   *amqp091.Connection
	channelPool  sync.Pool
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	db := database.New()

	rabbitConn, err := connectRabbitMqWithRetry()
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
		return nil
	}
	txManager := unitofwork.NewTransactionManager(db.DB())
	oderRepo := repositories.NewOrderRepository(db.DB())
	NewServer := &Server{
		port: port,
		db:   db,
		orderService: services.NewOrderService(
			oderRepo,
		),
		unitofwork: unitofwork.NewUnitOfWork(
			oderRepo,
			txManager,
		),
		rabbitConn: rabbitConn,
	}

	NewServer.InitChannelPool()

	// err = NewServer.setupRabbitMQListener()
	// if err != nil {
	// 	log.Fatalf("Failed to setup RabbitMQ listener: %v", err)
	// 	return nil
	// }

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
