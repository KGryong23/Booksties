package server

import (
	"InventoryService/internal/models"
	"context"
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func (s *Server) handleInventoryCreation(inventory models.AddOrUpdateInventoryDto, msg *amqp091.Delivery, retryCount int32) bool {
	id, err := s.unitofwork.CreateInventoryAndInventoryTransaction(inventory)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to create inventory: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Inventory created successfully: %v\n", Green, Reset, id)
	msg.Ack(false)
	return true
}

func (s *Server) handleInventoryUpdate(inventory []models.UpdateInventoryAndCreateInventoryTransactionDto, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.unitofwork.UpdateInventoryAndCreateInventoryTransaction(inventory)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to updated inventory: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Inventory updated successfully", Green, Reset)
	msg.Ack(false)
	return true
}

func (s *Server) handleInventoryDelete(inventory models.DeleteInventoryByProdIDDto, msg *amqp091.Delivery, retryCount int32) bool {
	err := s.inventoryService.DeleteInventoryByProdID(inventory.ProductID)
	if err != nil {
		log.Printf("%s[ERROR]%s Failed to deleted inventory: %v\n", Red, Reset, err)
		time.Sleep(1 * time.Second)
		s.publishRetryMessage(msg, retryCount)
		msg.Nack(false, false)
		return false
	}
	log.Printf("%s[SUCCESS]%s Inventory deleted successfully: %v\n", Green, Reset, inventory.ProductID)
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
