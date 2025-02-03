package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

const (
	MaxRetries = 3
	RetryDelay = 10 * time.Second
)

func (s *Server) sendMessageWithRetry(action string, data interface{}) error {
	channel := s.getChannel()
	defer s.releaseChannel(channel)

	err := s.ensureExchangeDeclared(channel)
	if err != nil {
		return fmt.Errorf("failed to declare exchange: %v", err)
	}

	dataBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to serialize product: %v", err)
	}

	routingKey := s.getRoutingKey(action)
	if routingKey == "" {
		return fmt.Errorf("unknown action: %v", action)
	}

	var publishErr error
	for attempt := 0; attempt < MaxRetries; attempt++ {
		publishErr = s.publishMessage(channel, routingKey, dataBytes)
		if publishErr == nil {
			log.Printf("Message published successfully on attempt %d\n", attempt+1)
			return nil
		}
		log.Printf("Failed to publish message, attempt %d: %v\n", attempt+1, publishErr)
		time.Sleep(RetryDelay)
	}

	return fmt.Errorf("failed to publish message after %d attempts: %v", MaxRetries, publishErr)
}

func (s *Server) ensureExchangeDeclared(channel *amqp091.Channel) error {
	return channel.ExchangeDeclare(
		"product_exchange",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
}

func (s *Server) getRoutingKey(action string) string {
	switch action {
	case "create":
		return "product.create"
	case "update":
		return "product.update"
	case "update_sold_avg":
		return "product.update_sold"
	case "delete":
		return "product.delete"
	case "inventory_create":
		return "inventory.create"
	case "inventory_delete":
		return "inventory.delete"
	case "update_genre":
		return "product.genre"
	default:
		return ""
	}
}

func (s *Server) publishMessage(channel *amqp091.Channel, routingKey string, dataBytes []byte) error {
	return channel.PublishWithContext(
		context.Background(),
		"product_exchange",
		routingKey,
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         dataBytes,
			Headers:      amqp091.Table{"x-retry-count": 0},
		},
	)
}
