package server

import (
	"InventoryService/internal/models"
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

	if err := declareExchangeAndQueue(channel); err != nil {
		return err
	}

	catalogMessages, err := channel.Consume(
		"inventory_create_delete_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages from inventory_create_queue: %v", err)
	}

	orderMessages, err := channel.Consume(
		"inventory_update_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages from inventory_update_queue: %v", err)
	}

	go s.processCatalogMessages(catalogMessages)
	go s.processOrderMessages(orderMessages)

	log.Println("Inventory service is waiting for messages from Catalog and Order...")
	return nil
}

func (s *Server) processCatalogMessages(messages <-chan amqp091.Delivery) {
	for msg := range messages {
		log.Printf("%s[INFO]%s Processing message from Catalog service\n", Green, Reset)
		if !s.processCatalogMessage(msg) {
			continue
		}
	}
}

func (s *Server) processOrderMessages(messages <-chan amqp091.Delivery) {
	for msg := range messages {
		log.Printf("%s[INFO]%s Processing message from Order service\n", Green, Reset)
		if !s.processOrderMessage(msg) {
			continue
		}
	}
}

func (s *Server) processCatalogMessage(msg amqp091.Delivery) bool {
	retryCount := getRetryCount(msg)
	if retryCount >= MaxRetries {
		log.Printf("%s[ERROR]%s Retry limit reached for Catalog message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
		msg.Nack(false, false)
		return false
	}

	switch msg.RoutingKey {
	case "inventory.create":
		var data models.AddOrUpdateInventoryDto
		if err := json.Unmarshal(msg.Body, &data); err != nil {
			log.Printf("%s[ERROR]%s Failed to unmarshal Catalog Add message: %v\n", Red, Reset, err)
			msg.Nack(false, false)
			return false
		}
		return s.handleInventoryCreation(data, &msg, retryCount)
	case "inventory.delete":
		var data models.DeleteInventoryByProdIDDto
		if err := json.Unmarshal(msg.Body, &data); err != nil {
			log.Printf("%s[ERROR]%s Failed to unmarshal Catalog Delete message: %v\n", Red, Reset, err)
			msg.Nack(false, false)
			return false
		}
		return s.handleInventoryDelete(data, &msg, retryCount)
	default:
		log.Printf("%s[ERROR]%s Unknown RoutingKey for Catalog message: %s\n", Red, Reset, msg.RoutingKey)
		msg.Nack(false, false)
		return false
	}
}

func (s *Server) processOrderMessage(msg amqp091.Delivery) bool {
	retryCount := getRetryCount(msg)
	if retryCount >= MaxRetries {
		log.Printf("%s[ERROR]%s Retry limit reached for Order message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
		msg.Nack(false, false)
		return false
	}

	var data []models.UpdateInventoryAndCreateInventoryTransactionDto
	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Printf("%s[ERROR]%s Failed to unmarshal Order message: %v\n", Red, Reset, err)
		msg.Nack(false, false)
		return false
	}

	return s.handleInventoryUpdate(data, &msg, retryCount)
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
		default:
			log.Printf("Unexpected type for x-retry-count: %T\n", v)
		}
	}
	return -1
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
		return fmt.Errorf("failed to declare product exchange: %v", err)
	}

	err = channel.ExchangeDeclare(
		"order_exchange",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare order exchange: %v", err)
	}

	_, err = channel.QueueDeclare(
		"inventory_create_delete_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare inventory_create_queue: %v", err)
	}

	err = channel.QueueBind(
		"inventory_create_delete_queue",
		"inventory.create",
		"product_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind inventory_create_queue: %v", err)
	}

	err = channel.QueueBind(
		"inventory_create_delete_queue",
		"inventory.delete",
		"product_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind inventory_delete_queue: %v", err)
	}

	_, err = channel.QueueDeclare(
		"inventory_update_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare inventory_update_queue: %v", err)
	}

	err = channel.QueueBind(
		"inventory_update_queue",
		"inventory.update",
		"order_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind inventory_update_queue: %v", err)
	}

	return nil
}
