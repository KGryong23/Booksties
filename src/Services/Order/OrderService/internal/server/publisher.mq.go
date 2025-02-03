package server

import (
	"OrderService/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

type Envelope struct {
	MessageType []string          `json:"messageType"`
	Message     interface{}       `json:"message"`
	Headers     map[string]string `json:"headers,omitempty"`
}

const (
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

	var publishErr error
	for attempt := 0; attempt < MaxRetries; attempt++ {
		if action == "inventory" {
			publishErr = s.publishMessageToInventory(channel, dataBytes)
		} else if action == "catalog" {
			publishErr = s.publishMessageToCatalog(channel, dataBytes)
		} else if action == "basket" {
			publishErr = s.publishMessageToBasket(channel, dataBytes)
		} else if action == "identity_pay" {
			publishErr = s.publishMessageToIdentity_Pay(channel, data.(models.PayOrder))
		} else if action == "identity_refund" {
			publishErr = s.publishMessageToIdentity_Refund(channel, data.(models.RefundTransaction))
		}
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
		"order_exchange",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
}

func (s *Server) publishMessageToInventory(channel *amqp091.Channel, inventoryBytes []byte) error {
	return channel.PublishWithContext(
		context.Background(),
		"order_exchange",
		"inventory.update",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         inventoryBytes,
		},
	)
}

func (s *Server) publishMessageToCatalog(channel *amqp091.Channel, catalogBytes []byte) error {
	return channel.PublishWithContext(
		context.Background(),
		"order_exchange",
		"catalog.update.sold",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         catalogBytes,
			Headers:      amqp091.Table{"x-retry-count": 0},
		},
	)
}

func (s *Server) publishMessageToBasket(channel *amqp091.Channel, catalogBytes []byte) error {
	return channel.PublishWithContext(
		context.Background(),
		"order_exchange",
		"basket.delete",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         catalogBytes,
			Headers:      amqp091.Table{"x-retry-count": 0},
		},
	)
}

func (s *Server) publishMessageToIdentity_Pay(channel *amqp091.Channel, payOrder models.PayOrder) error {
	envelope := Envelope{
		MessageType: []string{"urn:message:CommonLib.Messaging.Events:PayOrder"},
		Message:     payOrder,
		Headers:     nil,
	}

	envelopeBytes, err := json.Marshal(envelope)
	if err != nil {
		return fmt.Errorf("failed to serialize envelope: %w", err)
	}

	return channel.PublishWithContext(
		context.Background(),
		"identitys",
		"identitys-pay-order",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         envelopeBytes,
		},
	)
}

func (s *Server) publishMessageToIdentity_Refund(channel *amqp091.Channel, refundOrder models.RefundTransaction) error {
	envelope := Envelope{
		MessageType: []string{"urn:message:CommonLib.Messaging.Events:RefundTransaction"},
		Message:     refundOrder,
		Headers:     nil,
	}

	envelopeBytes, err := json.Marshal(envelope)
	if err != nil {
		return fmt.Errorf("failed to serialize envelope: %w", err)
	}

	return channel.PublishWithContext(
		context.Background(),
		"identitys",
		"identitys-refund-transaction",
		false,
		false,
		amqp091.Publishing{
			DeliveryMode: amqp091.Persistent,
			ContentType:  "application/json",
			Body:         envelopeBytes,
		},
	)
}
