package server

// const (
// 	MaxRetries = 3
// 	RetryDelay = 10 * time.Second
// )

// func (s *Server) sendMessageWithRetry(basket interface{}) error {
// 	channel := s.getChannel()
// 	defer s.releaseChannel(channel)

// 	err := s.ensureExchangeDeclared(channel)
// 	if err != nil {
// 		return fmt.Errorf("failed to declare exchange: %v", err)
// 	}

// 	basketBytes, err := json.Marshal(basket)
// 	if err != nil {
// 		return fmt.Errorf("failed to serialize product: %v", err)
// 	}

// 	var publishErr error
// 	for attempt := 0; attempt < MaxRetries; attempt++ {
// 		publishErr = s.publishMessage(channel, basketBytes)
// 		if publishErr == nil {
// 			log.Printf("Message published successfully on attempt %d\n", attempt+1)
// 			return nil
// 		}
// 		log.Printf("Failed to publish message, attempt %d: %v\n", attempt+1, publishErr)
// 		time.Sleep(RetryDelay)
// 	}

// 	return fmt.Errorf("failed to publish message after %d attempts: %v", MaxRetries, publishErr)
// }

// func (s *Server) ensureExchangeDeclared(channel *amqp091.Channel) error {
// 	return channel.ExchangeDeclare(
// 		"basket_exchange",
// 		"topic",
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// }

// func (s *Server) publishMessage(channel *amqp091.Channel, basketBytes []byte) error {
// 	return channel.PublishWithContext(
// 		context.Background(),
// 		"basket_exchange",
// 		"order.create",
// 		false,
// 		false,
// 		amqp091.Publishing{
// 			DeliveryMode: amqp091.Persistent,
// 			ContentType:  "application/json",
// 			Body:         basketBytes,
// 			Headers:      amqp091.Table{"x-retry-count": 0},
// 		},
// 	)
// }
