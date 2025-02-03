package server

const (
	Red        = "\033[31m"
	Green      = "\033[32m"
	Yellow     = "\033[33m"
	Reset      = "\033[0m"
	MaxRetries = 3
)

// func (s *Server) setupRabbitMQListener() error {
// 	channel, err := s.rabbitConn.Channel()
// 	if err != nil {
// 		return fmt.Errorf("failed to open a channel: %v", err)
// 	}
// 	if err := declareExchangeAndQueue(channel); err != nil {
// 		return err
// 	}

// 	messages, err := channel.Consume(
// 		"order_queue",
// 		"",
// 		false,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to consume messages: %v", err)
// 	}

// 	go s.processMessages(messages)

// 	log.Println("Order service is waiting for messages from Basket...")
// 	return nil
// }

// func (s *Server) processMessages(messages <-chan amqp091.Delivery) {
// 	for msg := range messages {
// 		if !s.processMessage(msg) {
// 			continue
// 		}
// 	}
// }

// func (s *Server) processMessage(msg amqp091.Delivery) bool {
// 	retryCount := getRetryCount(msg)

// 	if retryCount >= MaxRetries {
// 		log.Printf("%s[ERROR]%s Retry limit reached for message with ID: %s. Dropping message.\n", Red, Reset, msg.AppId)
// 		msg.Nack(false, false)
// 		return false
// 	}
// 	order, err := s.getOrderFromMessage(msg)
// 	if err != nil {
// 		log.Printf("Failed to unmarshal message: %v", err)
// 		msg.Nack(false, false)
// 		return false
// 	}

// 	id, err := s.unitofwork.CreateOrderAndOrderItems(order)
// 	if err != nil {
// 		log.Printf("%s[ERROR]%s Failed to create order: %v\n", Red, Reset, err)
// 		s.publishRetryMessage(&msg, retryCount)
// 		return false
// 	}

// 	log.Printf("%s[SUCCESS]%s Order created successfully: %v\n", Green, Reset, id)
// 	msg.Ack(false)
// 	return true
// }

// func (s *Server) getOrderFromMessage(msg amqp091.Delivery) (*models.CreateOrderAndOrderItemDto, error) {
// 	var order models.CreateOrderAndOrderItemDto
// 	if err := json.Unmarshal(msg.Body, &order); err != nil {
// 		return nil, err
// 	}
// 	return &order, nil
// }

// func getRetryCount(msg amqp091.Delivery) int {
// 	if count, ok := msg.Headers["x-retry-count"]; ok {
// 		if retry, ok := count.(int); ok {
// 			return retry
// 		}
// 	}
// 	return 0
// }

// func declareExchangeAndQueue(channel *amqp091.Channel) error {
// 	err := channel.ExchangeDeclare(
// 		"basket_exchange",
// 		"topic",
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to declare exchange: %v", err)
// 	}

// 	_, err = channel.QueueDeclare(
// 		"order_queue",
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to declare a queue: %v", err)
// 	}

// 	err = channel.QueueBind(
// 		"order_queue",
// 		"order.create",
// 		"basket_exchange",
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to bind queue: %v", err)
// 	}

// 	return nil
// }

// func (s *Server) publishRetryMessage(msg *amqp091.Delivery, retryCount int) {
// 	retryCount++
// 	msg.Headers["x-retry-count"] = retryCount

// 	channel := s.getChannel()
// 	defer s.releaseChannel(channel)

// 	err := channel.PublishWithContext(
// 		context.Background(),
// 		msg.Exchange,
// 		msg.RoutingKey,
// 		false,
// 		false,
// 		amqp091.Publishing{
// 			ContentType:   msg.ContentType,
// 			Body:          msg.Body,
// 			Headers:       msg.Headers,
// 			DeliveryMode:  amqp091.Persistent,
// 			CorrelationId: msg.CorrelationId,
// 		},
// 	)

// 	if err != nil {
// 		log.Printf("%s[ERROR]%s Failed to republish message with ID: %s, Error: %v\n", Red, Reset, msg.AppId, err)
// 	} else {
// 		log.Printf("%s[RETRY]%s Retrying message with ID: %s, Retry count: %d\n", Yellow, Reset, msg.AppId, retryCount)
// 	}
// }
