package server

import (
	"BasketService/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

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

	messages, err := channel.Consume(
		"basket_queue",
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

	log.Println("Basket service is waiting for messages from Order...")
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
	basket, err := s.getIdFromMessage(msg)
	if err != nil {
		log.Printf("Failed to unmarshal message: %v", err)
		msg.Nack(false, false)
		return false
	}

	err = s.basketService.ClearBasketByUserId(basket.UserID)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to delete basket: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(&msg, retryCount)
		msg.Nack(false, false)
		return false
	}

	log.Printf("%s[SUCCESS]%s Basket deleted successfully: %v\n", Green, Reset, basket.UserID)
	msg.Ack(false)
	return true
}

func (s *Server) getIdFromMessage(msg amqp091.Delivery) (*models.MqBasketDeleteDto, error) {
	var basket models.MqBasketDeleteDto
	if err := json.Unmarshal(msg.Body, &basket); err != nil {
		return nil, err
	}
	return &basket, nil
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
		"order_exchange",
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
		"basket_queue",
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
		"basket_queue",
		"basket.delete",
		"order_exchange",
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %v", err)
	}

	return nil
}

func (s *Server) publishRetryMessage(msg *amqp091.Delivery, retryCount int32) {
	retryCount++
	if msg.Headers == nil {
		msg.Headers = make(amqp091.Table)
	}
	msg.Headers["x-retry-count"] = retryCount

	channel, err := s.rabbitConn.Channel()
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to open a channel for republishing: %v\n", Red, Reset, err)
		return
	}
	defer channel.Close()

	err = channel.PublishWithContext(
		context.Background(),
		msg.Exchange,
		msg.RoutingKey,
		false,
		false,
		amqp091.Publishing{
			ContentType:   msg.ContentType,
			Body:          msg.Body,
			Headers:       msg.Headers,
			DeliveryMode:  amqp091.Persistent,
			CorrelationId: msg.CorrelationId,
		},
	)

	if err != nil {
		log.Printf("%s[ERROR]%s Failed to republish message with ID: %s, Error: %v\n", Red, Reset, msg.AppId, err)
	} else {
		log.Printf("%s[RETRY]%s Retrying message with ID: %s, Retry count: %d\n", Yellow, Reset, msg.AppId, retryCount)
	}
}
