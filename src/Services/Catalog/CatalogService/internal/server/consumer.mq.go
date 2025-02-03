package server

import (
	"CatalogService/internal/models"
	"encoding/json"
	"fmt"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

const (
	Red    = "\033[31m"
	Green  = "\033[32m"
	Yellow = "\033[33m"
	Reset  = "\033[0m"
)

func (s *Server) setupRabbitMQListener() error {
	channel, err := s.rabbitConn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %v", err)
	}
	if err := declareExchangeAndQueue(channel); err != nil {
		return err
	}

	reviewMessages, err := channel.Consume(
		"catalog_update_review_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages from catalog_update_review_queue: %v", err)
	}

	orderMessages, err := channel.Consume(
		"catalog_update_sold_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages from catalog_update_sold_queue: %v", err)
	}

	go s.processReviewMessages(reviewMessages)
	go s.processOrderMessages(orderMessages)

	log.Println("Catalog service is waiting for messages from Order and Review...")
	return nil
}

func (s *Server) processReviewMessages(messages <-chan amqp091.Delivery) {
	for msg := range messages {
		log.Printf("%s[INFO]%s Processing message from Review service\n", Green, Reset)
		if !s.processReviewMessage(msg) {
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

func (s *Server) processReviewMessage(msg amqp091.Delivery) bool {
	retryCount := getRetryCount(msg)

	if retryCount >= MaxRetries {
		log.Printf("%s[ERROR]%s Retry limit reached for Review message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
		msg.Nack(false, false)
		return false
	}

	var data models.ReceiveReviewDto
	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Printf("%s[ERROR]%s Failed to unmarshal Review message: %v\n", Red, Reset, err)
		msg.Nack(false, false)
		return false
	}

	return s.handleUpdateReview(data, &msg, retryCount)
}

func (s *Server) processOrderMessage(msg amqp091.Delivery) bool {
	retryCount := getRetryCount(msg)

	if retryCount >= MaxRetries {
		log.Printf("%s[ERROR]%s Retry limit reached for Order message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
		msg.Nack(false, false)
		return false
	}

	var data []models.ReceiveSoldDto
	if err := json.Unmarshal(msg.Body, &data); err != nil {
		log.Printf("%s[ERROR]%s Failed to unmarshal Order message: %v\n", Red, Reset, err)
		msg.Nack(false, false)
		return false
	}

	return s.handleUpdateSold(data, &msg, retryCount)
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
		"review_exchange",
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
		"catalog_update_review_queue",
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
		"catalog_update_review_queue",
		"catalog.update.review",
		"review_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %v", err)
	}

	_, err = channel.QueueDeclare(
		"catalog_update_sold_queue",
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
		"catalog_update_sold_queue",
		"catalog.update.sold",
		"order_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %v", err)
	}

	return nil
}
