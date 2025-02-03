package server

import (
	"CatalogService/internal/models"
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/rabbitmq/amqp091-go"
)

func (s *Server) handleUpdateSold(products []models.ReceiveSoldDto, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.UpdateSoldQuantity(products)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to updated sold products: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	s.handleSendListProductUpdated(products)
	log.Printf("%s[SUCCESS]%s Sold product updated successfully", Green, Reset)
	msg.Ack(false)
	return true
}

func (s *Server) handleUpdateReview(product models.ReceiveReviewDto, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.UpdateReview(&product)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to updated review products: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	s.handleSendProductUpdated(product.ProductID)
	log.Printf("%s[SUCCESS]%s Review product updated successfully", Green, Reset)
	msg.Ack(false)
	return true
}

func (s *Server) handleSendListProductUpdated(products []models.ReceiveSoldDto) {
	for _, product := range products {
		data, err := s.productService.GetProductToUpdate(product.ProductID)
		if err != nil {
			continue
		}
		err = s.sendMessageWithRetry("update_sold_avg", data)
		if err != nil {
			continue
		}
	}
}

func (s *Server) handleSendProductUpdated(productID uuid.UUID) {
	data, err := s.productService.GetProductToUpdate(productID)
	if err != nil {
		return
	}
	err = s.sendMessageWithRetry("update_sold_avg", data)
	if err != nil {
		return
	}
}

func (s *Server) publishRetryMessage(msg *amqp091.Delivery, retryCount int32) {
	retryCount++
	if msg.Headers == nil {
		msg.Headers = make(amqp091.Table)
	}
	msg.Headers["x-retry-count"] = retryCount

	channel := s.getChannel()
	defer s.releaseChannel(channel)

	err := channel.PublishWithContext(
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
