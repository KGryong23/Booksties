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
	RetryDelay = 10 * time.Second
	MaxRetries = 3
)

func (s *Server) sendMessageWithRetry(data interface{}) error {
	channel := s.getChannel()
	defer s.releaseChannel(channel)

	err := s.ensureExchangeDeclared(channel)
	if err != nil {
		return fmt.Errorf("failed to declare exchange: %v", err)
	}

	dataBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to serialize review: %v", err)
	}

	var publishErr error
	for attempt := 0; attempt < MaxRetries; attempt++ {
		publishErr = s.publishMessageToCatalog(channel, dataBytes)
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
		"review_exchange",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
}

func (s *Server) publishMessageToCatalog(channel *amqp091.Channel, reviewBytes []byte) error {
	return channel.PublishWithContext(
		context.Background(),
		"review_exchange",
		"catalog.update.review",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         reviewBytes,
			Headers:      amqp091.Table{"x-retry-count": 0},
		},
	)
}
