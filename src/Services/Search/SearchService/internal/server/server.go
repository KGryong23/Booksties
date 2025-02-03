package server

import (
	"SearchService/internal/repositories"
	"SearchService/internal/services"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/elastic/go-elasticsearch/v8"
	_ "github.com/joho/godotenv/autoload"
	"github.com/rabbitmq/amqp091-go"
)

type Server struct {
	port           int
	rabbitConn     *amqp091.Connection
	productService services.ProductService
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	rabbitConn, err := connectRabbitMqWithRetry()
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
		return nil
	}

	typedClient, err := connectElasticsearchWithRetry()
	if err != nil {
		log.Fatalf("Failed to connect to Elasticsearch: %v", err)
		return nil
	}

	NewServer := &Server{
		port:       port,
		rabbitConn: rabbitConn,
		productService: services.NewProductService(
			repositories.NewProductRepository(typedClient),
		),
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

func connectElasticsearchWithRetry() (*elasticsearch.TypedClient, error) {
	var typedClient *elasticsearch.TypedClient
	var err error

	maxRetries := 5
	retryDelay := time.Second * 5
	for i := 0; i < maxRetries; i++ {
		typedClient, err = elasticsearch.NewTypedClient(elasticsearch.Config{
			Addresses: []string{
				os.Getenv("ELASTICSEARCH_URL"),
			},
		})

		if err == nil {
			log.Printf("Successfully connected to Elasticsearch on attempt %d\n", i+1)
			return typedClient, nil
		}

		log.Printf("Failed to connect to Elasticsearch, retrying... (%d/%d)", i+1, maxRetries)
		time.Sleep(retryDelay)
	}

	return nil, err
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

func checkElasticsearchHealth() error {
	cfg := elasticsearch.Config{
		Addresses: []string{os.Getenv("ELASTICSEARCH_URL")},
	}
	es, err := elasticsearch.NewClient(cfg)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err = es.Ping(es.Ping.WithContext(ctx))
	return err
}
