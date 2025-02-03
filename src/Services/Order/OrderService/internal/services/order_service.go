package services

import (
	"OrderService/internal/models"
	"OrderService/internal/repositories"

	"github.com/google/uuid"
)

type OrderService interface {
	DeleteOrder(id uuid.UUID) error
	GetOdersByUserId(id uuid.UUID) ([]models.GetOrdersAndOrderItemsDto, error)
	UpdateOrderStatus(order *models.UpdateOrderDto) error
	GetOrderItemsList(orderID uuid.UUID) ([]models.GetOrderItemListDto, error)
	GetOrderStatus(orderID uuid.UUID) (*uuid.UUID, float64, *string, error)
	GetCountDelivered(orderID uuid.UUID) (*[]models.SendUpdateSoldToCatalogDto, error)
	countDelivered(orderItems []models.GetOrderItemListDto) ([]models.SendUpdateSoldToCatalogDto, error)
	UpdateFullAddress(address *models.UpdateAddress) error
	GetSalesByMonth() (*models.MonthlyData, error)
	GetSalesData() (*models.SalesResponseDto, error)
	GetOrderPaginate(page int, limit int, field string, order string, status *string, user_id *uuid.UUID) ([]models.GetOrdersPaginateDto, error)
}

type OrderServiceImpl struct {
	orderRepo repositories.OrderRepository
}

func NewOrderService(orderRepo repositories.OrderRepository) OrderService {
	return &OrderServiceImpl{
		orderRepo: orderRepo,
	}
}

func (o *OrderServiceImpl) UpdateFullAddress(address *models.UpdateAddress) error {
	return o.orderRepo.UpdateFullAddress(address)
}

func (o *OrderServiceImpl) DeleteOrder(id uuid.UUID) error {
	return o.orderRepo.DeleteOrder(id)
}

func (o *OrderServiceImpl) GetOdersByUserId(id uuid.UUID) ([]models.GetOrdersAndOrderItemsDto, error) {
	orders, err := o.orderRepo.GetOdersByUserId(id)
	if err != nil {
		return nil, err
	}
	ordersGroup := groupByOrderID(orders)
	return ordersGroup, nil
}

func (o *OrderServiceImpl) UpdateOrderStatus(order *models.UpdateOrderDto) error {
	return o.orderRepo.UpdateOrderStatus(order)
}

func groupByOrderID(orders []models.GetOrdersByUserIdDto) []models.GetOrdersAndOrderItemsDto {
	ordersGrouped := make(map[models.GetOrdersDto][]models.GetOrderItemsDto)
	for _, order := range orders {
		orderKey := models.GetOrdersDto{
			OrderID:     order.OrderID,
			Status:      order.Status,
			TotalAmount: order.TotalAmount,
			CreatedAt:   order.CreatedAt,
			FullAddress: order.FullAddress,
		}
		ordersGrouped[orderKey] = append(ordersGrouped[orderKey], models.GetOrderItemsDto{
			ProductID: order.ProductID,
			Quantity:  order.Quantity,
			Price:     order.Price,
		})
	}
	ordersAndOrdeItemsGrouped := make([]models.GetOrdersAndOrderItemsDto, 0, len(ordersGrouped))
	for order, orderItem := range ordersGrouped {
		ordersAndOrdeItemsGrouped = append(ordersAndOrdeItemsGrouped, models.GetOrdersAndOrderItemsDto{
			GetOrdersDto: order,
			OrderItems:   orderItem,
		})
	}
	return ordersAndOrdeItemsGrouped
}

func (o *OrderServiceImpl) GetOrderItemsList(orderID uuid.UUID) ([]models.GetOrderItemListDto, error) {
	return o.orderRepo.GetOrderItemsList(orderID)
}

func (o *OrderServiceImpl) GetOrderStatus(orderID uuid.UUID) (*uuid.UUID, float64, *string, error) {
	return o.orderRepo.GetOrderStatus(orderID)
}

func (o *OrderServiceImpl) GetCountDelivered(orderID uuid.UUID) (*[]models.SendUpdateSoldToCatalogDto, error) {
	orderItems, err := o.orderRepo.GetOrderItemsList(orderID)
	if err != nil {
		return nil, err
	}
	solds, err := o.countDelivered(orderItems)
	if err != nil {
		return nil, err
	}
	return &solds, err
}

func (o *OrderServiceImpl) countDelivered(orderItems []models.GetOrderItemListDto) ([]models.SendUpdateSoldToCatalogDto, error) {
	var solds []models.SendUpdateSoldToCatalogDto
	for _, orderItem := range orderItems {
		sum, err := o.orderRepo.CountDelivered(orderItem.ProductID)
		if err != nil {
			return solds, err
		}
		solds = append(solds, models.SendUpdateSoldToCatalogDto{
			ProductID:    orderItem.ProductID,
			SoldQuantity: *sum,
		})
	}
	return solds, nil
}

func (o *OrderServiceImpl) GetSalesByMonth() (*models.MonthlyData, error) {
	return o.orderRepo.GetSalesByMonth()
}

func (o *OrderServiceImpl) GetSalesData() (*models.SalesResponseDto, error) {
	return o.orderRepo.GetSalesData()
}

func (o *OrderServiceImpl) GetOrderPaginate(page int, limit int, field string, order string, status *string, user_id *uuid.UUID) ([]models.GetOrdersPaginateDto, error) {
	return o.orderRepo.GetOrderPaginate(page, limit, field, order, status, user_id)
}
