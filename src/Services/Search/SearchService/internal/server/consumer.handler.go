package server

import (
	"SearchService/internal/models"
	"context"
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func (s *Server) handleProductCreation(product *models.CreateProductDTO, msg *amqp091.Delivery, retryCount int32) bool {
	_, err := s.productService.CreateProduct(*product)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to create product: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Product created successfully: %v\n", Green, Reset, (*product).ID)
	msg.Ack(false)
	return true
}

func (s *Server) handleProductDelete(id string, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.DeleteProduct(id)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to delete product: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Product deleted successfully: %v\n", Green, Reset, id)
	msg.Ack(false)
	return true
}

func (s *Server) handleProductUpdate(product *models.UpdateProductDTO, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.UpdateProduct(*product)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to update product: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Product updated successfully: %v\n", Green, Reset, (*product).ID)
	msg.Ack(false)
	return true
}

func (s *Server) handleUpdateSoldAndRating(product *models.ReceiveUpdateSoldAndAvgRatingDTO, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.UpdateSoldAndRating(*product)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to update product: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Product updated successfully: %v\n", Green, Reset, (*product).ID)
	msg.Ack(false)
	return true
}

func (s *Server) handleUpdateProductGenre(genre *models.UpdateProductGenreDTO, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.productService.UpdateProductGenre(*genre)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to update product genre: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Product genre updated successfully: %v\n", Green, Reset, (*genre).ID)
	msg.Ack(false)
	return true
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
