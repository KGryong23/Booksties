package server

import (
	"SearchService/internal/models"
	"encoding/json"
	"fmt"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

const (
	Red        = "\033[31m"
	Green      = "\033[32m"
	Yellow     = "\033[33m"
	Reset      = "\033[0m"
	MaxRetries = 3
)

func (s *Server) setupRabbitMQListener() error {
	channel, err := s.rabbitConn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %v", err)
	}

	if err := channel.Qos(
		5,
		0,
		false,
	); err != nil {
		return fmt.Errorf("failed to set QoS: %v", err)
	}

	if err := declareExchangeAndQueue(channel); err != nil {
		return err
	}

	messages, err := channel.Consume(
		"search_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages: %v", err)
	}

	go s.processMessages(messages)

	log.Println("Search service is waiting for messages from Catalog...")
	return nil
}

func (s *Server) processMessages(messages <-chan amqp091.Delivery) {
	for msg := range messages {
		if !s.processMessage(msg) {
			continue
		}
	}
}

func (s *Server) processMessage(msg amqp091.Delivery) bool {
	retryCount := getRetryCount(msg)

	if retryCount >= MaxRetries {
		log.Printf("%s[ERROR]%s Retry limit reached for message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
		msg.Nack(false, false)
		return false
	}

	product, err := s.getProductFromMessage(msg)
	if err != nil {
		log.Printf("Failed to unmarshal message: %v", err)
		msg.Nack(false, false)
		return false
	}

	if !s.routeMessage(msg.RoutingKey, product, &msg, retryCount) {
		return false
	}

	return true
}

func (s *Server) getProductFromMessage(msg amqp091.Delivery) (interface{}, error) {
	var product interface{}
	switch msg.RoutingKey {
	case "product.create":
		product = new(models.CreateProductDTO)
	case "product.update":
		product = new(models.UpdateProductDTO)
	case "product.delete":
		product = new(models.DeleteProductDTO)
	case "product.update_sold":
		product = new(models.ReceiveUpdateSoldAndAvgRatingDTO)
	case "product.genre":
		product = new(models.UpdateProductGenreDTO)
	default:
		return nil, fmt.Errorf("unknown routing key: %s", msg.RoutingKey)
	}

	if err := json.Unmarshal(msg.Body, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *Server) routeMessage(routingKey string, product interface{}, msg *amqp091.Delivery, retryCount int32) bool {
	switch routingKey {
	case "product.create":
		return s.handleProductCreation(product.(*models.CreateProductDTO), msg, retryCount)
	case "product.update":
		return s.handleProductUpdate(product.(*models.UpdateProductDTO), msg, retryCount)
	case "product.delete":
		return s.handleProductDelete(product.(*models.DeleteProductDTO).ID, msg, retryCount)
	case "product.update_sold":
		return s.handleUpdateSoldAndRating(product.(*models.ReceiveUpdateSoldAndAvgRatingDTO), msg, retryCount)
	case "product.genre":
		return s.handleUpdateProductGenre(product.(*models.UpdateProductGenreDTO), msg, retryCount)
	default:
		log.Printf("Unknown routing key: %s", routingKey)
		msg.Nack(false, false)
		return false
	}
}

func getRetryCount(msg amqp091.Delivery) int32 {
	if count, ok := msg.Headers["x-retry-count"]; ok {
		switch v := count.(type) {
		case int:
			return int32(v)
		case int32:
			return v
		case int64:
			return int32(v)
		case float64:
			return int32(v)
		default:
			log.Printf("%s[ERROR]%s Retry count header has unsupported type: %T, value: %v\n", Red, Reset, count, count)
		}
	}
	return 0
}

func declareExchangeAndQueue(channel *amqp091.Channel) error {
	err := channel.ExchangeDeclare(
		"product_exchange",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare exchange: %v", err)
	}

	_, err = channel.QueueDeclare(
		"search_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare a queue: %v", err)
	}

	err = channel.QueueBind(
		"search_queue",
		"product.*",
		"product_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %v", err)
	}

	return nil
}
