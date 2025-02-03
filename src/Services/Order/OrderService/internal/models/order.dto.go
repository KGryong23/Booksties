package models

import (
	"time"

	"github.com/google/uuid"
)

type CreateOrderDto struct {
	UserID      uuid.UUID `json:"user_id"`
	TotalAmount float64   `json:"total_amount"`
	FullAddress *string   `json:"full_address"`
}

type CreateOrderItem struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
}
type CreateOrderAndOrderItemDto struct {
	CreateOrderDto
	OrderItems []CreateOrderItem `json:"order_items"`
}

type GetOrdersByUserIdDto struct {
	OrderID     uuid.UUID `json:"order_id"`
	ProductID   uuid.UUID `json:"product_id"`
	Status      string    `json:"status"`
	TotalAmount float64   `json:"total_amount"`
	Quantity    int       `json:"quantity"`
	Price       float64   `json:"price"`
	CreatedAt   time.Time `json:"created_at"`
	FullAddress *string   `json:"full_address"`
}

type GetOrdersDto struct {
	OrderID     uuid.UUID `json:"order_id"`
	Status      string    `json:"status"`
	TotalAmount float64   `json:"total_amount"`
	CreatedAt   time.Time `json:"created_at"`
	FullAddress *string   `json:"full_address"`
}

type GetOrderItemsDto struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
}

type GetOrderItemListDto struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
}

type GetOrdersAndOrderItemsDto struct {
	GetOrdersDto
	OrderItems []GetOrderItemsDto `json:"order_items"`
}

type GetOrderItemsDetailDto struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Author   string    `json:"author"`
	ImageURL *string   `json:"image_url"`
	Quantity int       `json:"quantity"`
	Price    float64   `json:"price"`
}

type GetOrdersAndOrderItemsDetailDto struct {
	GetOrdersDto
	OrderItems []GetOrderItemsDetailDto `json:"order_items"`
}

type UpdateInventoryAndCreateInventoryTransactionDto struct {
	ProductID       uuid.UUID `json:"product_id"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	Reason          string    `json:"reason"`
}

type UpdateOrderDto struct {
	OrderID uuid.UUID `json:"order_id"`
	Status  string    `json:"status"`
}

type SendUpdateSoldToCatalogDto struct {
	ProductID    uuid.UUID `json:"product_id"`
	SoldQuantity int       `json:"sold_quantity"`
}

type MqBasketDeleteDto struct {
	UserID uuid.UUID `json:"user_id"`
}

type PayOrder struct {
	UserId      uuid.UUID `json:"UserId"`
	OrderAmount float64   `json:"OrderAmount"`
	Description string    `json:"Description"`
}

type UpdateAddress struct {
	OrderID     uuid.UUID `json:"order_id"`
	FullAddress string    `json:"full_address"`
}

type MonthlyData struct {
	Labels []string  `json:"labels"`
	Data   []float64 `json:"data"`
}

type SalesResponseDto struct {
	TodaySales        float64 `json:"today_sales"`
	CurrentMonthSales float64 `json:"current_month_sales"`
	PercentageChange  float64 `json:"percentage_change"`
	TotalSales        float64 `json:"total_sales"`
}

type GetOrdersPaginateDto struct {
	OrderID     uuid.UUID `json:"order_id"`
	UserId      uuid.UUID `json:"userId"`
	Status      string    `json:"status"`
	TotalAmount float64   `json:"total_amount"`
	CreatedAt   time.Time `json:"created_at"`
	FullAddress *string   `json:"full_address"`
}

type RefundTransaction struct {
	UserId       uuid.UUID `json:"UserId"`
	RefundAmount float64   `json:"RefundAmount"`
	Description  string    `json:"Description"`
}
