package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rabbitmq/amqp091-go"

	"BasketService/internal/database"
	"BasketService/internal/repositories"
	"BasketService/internal/services"
	"BasketService/internal/unitofwork"
)

type Server struct {
	port          int
	db            database.Service
	unitofwork    unitofwork.Unitofwork
	basketService services.BasketService
	rabbitConn    *amqp091.Connection
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
	basketRepo := repositories.NewBasketRepository(db.DB())
	NewServer := &Server{
		port:          port,
		unitofwork:    unitofwork.NewUnitOfWork(basketRepo, txManager),
		basketService: services.NewBasketService(basketRepo),
		db:            db,
		rabbitConn:    rabbitConn,
	}

	err = NewServer.setupRabbitMQListener()
	if err != nil {
		log.Fatalf("Failed to setup RabbitMQ listener: %v", err)
		return nil
	}

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
