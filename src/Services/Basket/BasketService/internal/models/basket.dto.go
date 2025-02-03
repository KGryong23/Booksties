package models

import "github.com/google/uuid"

type CreateBasketItemDto struct {
	UserID    uuid.UUID `json:"user_id"`
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type RemoveBasketItemDto struct {
	UserID    uuid.UUID `json:"user_id"`
	ProductID uuid.UUID `json:"product_id"`
}

type UpdateBasketItemQuantityDto struct {
	UserID    uuid.UUID `json:"user_id"`
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type GetBasketItemsDto struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type GetBasketItemsDetailDto struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Author             string    `json:"author"`
	DiscountPercentage int       `json:"discount_percentage"`
	ImageURL           *string   `json:"image_url"`
	Quantity           int       `json:"quantity"`
	Price              float64   `json:"price"`
}

type MqOrderDto struct {
	UserID      uuid.UUID `json:"user_id"`
	TotalAmount float64   `json:"total_amount"`
}

type MqOrderItem struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
}
type MqOrderAndOrderItemDto struct {
	MqOrderDto
	OrderItems []MqOrderItem `json:"order_items"`
}

type MqBasketDeleteDto struct {
	UserID uuid.UUID `json:"user_id"`
}
