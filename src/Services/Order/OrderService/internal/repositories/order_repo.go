package repositories

import (
	"OrderService/internal/models"
	"OrderService/internal/query"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const dbTimeout = 3 * time.Second

type OrderRepository interface {
	CreateOrder(tx *sql.Tx, order *models.CreateOrderDto) (uuid.UUID, error)
	CreateOrderItems(tx *sql.Tx, orderid uuid.UUID, orderitems []models.CreateOrderItem) error
	DeleteOrder(id uuid.UUID) error
	GetOdersByUserId(id uuid.UUID) ([]models.GetOrdersByUserIdDto, error)
	GetOrderItemsList(orderID uuid.UUID) ([]models.GetOrderItemListDto, error)
	UpdateOrderStatus(order *models.UpdateOrderDto) error
	GetOrderStatus(orderID uuid.UUID) (*uuid.UUID, float64, *string, error)
	CountDelivered(productID uuid.UUID) (*int, error)
	UpdateFullAddress(address *models.UpdateAddress) error
	GetSalesByMonth() (*models.MonthlyData, error)
	GetSalesData() (*models.SalesResponseDto, error)
	GetOrderPaginate(page int, limit int, field string, order string, status *string, user_id *uuid.UUID) ([]models.GetOrdersPaginateDto, error)
}

type OrderRepositoryImpl struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) OrderRepository {
	return &OrderRepositoryImpl{
		db: db,
	}
}

func (o *OrderRepositoryImpl) CreateOrder(tx *sql.Tx, order *models.CreateOrderDto) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	orderid := uuid.New()
	_, err := tx.ExecContext(ctx, query.CREATE_ORDER, orderid, order.UserID, order.TotalAmount, order.FullAddress)
	if err != nil {
		return uuid.Nil, err
	}
	return orderid, nil
}

func (o *OrderRepositoryImpl) CreateOrderItems(tx *sql.Tx, orderid uuid.UUID, orderitems []models.CreateOrderItem) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	itemsJSON, err := json.Marshal(orderitems)
	if err != nil {
		return fmt.Errorf("failed to marshal order items: %w", err)
	}

	_, err = tx.ExecContext(ctx, query.CREATE_ORDER_ITEMS, orderid, string(itemsJSON))
	if err != nil {
		return err
	}
	return nil
}

func (o *OrderRepositoryImpl) DeleteOrder(id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := o.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.DELETE_ORDER, id)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (o *OrderRepositoryImpl) GetOdersByUserId(id uuid.UUID) ([]models.GetOrdersByUserIdDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := o.db.QueryContext(ctx, query.GET_ORDERS_BY_USER_ID, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []models.GetOrdersByUserIdDto
	for rows.Next() {
		var order models.GetOrdersByUserIdDto
		err := rows.Scan(
			&order.OrderID,
			&order.Status,
			&order.TotalAmount,
			&order.CreatedAt,
			&order.FullAddress,
			&order.ProductID,
			&order.Quantity,
			&order.Price,
		)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}

func (o *OrderRepositoryImpl) UpdateOrderStatus(order *models.UpdateOrderDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := o.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.UPDATE_ORDER_STATUS, order.OrderID, order.Status)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (o *OrderRepositoryImpl) GetOrderItemsList(orderID uuid.UUID) ([]models.GetOrderItemListDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var orderItems []models.GetOrderItemListDto
	rows, err := o.db.QueryContext(ctx, query.GET_ORDER_ITEM_LIST, orderID)
	if err != nil {
		return orderItems, err
	}
	for rows.Next() {
		var orderItem models.GetOrderItemListDto
		err := rows.Scan(
			&orderItem.ProductID,
			&orderItem.Quantity,
			&orderItem.Price,
		)
		if err != nil {
			return orderItems, err
		}
		orderItems = append(orderItems, orderItem)
	}
	return orderItems, nil
}

func (o *OrderRepositoryImpl) GetOrderStatus(orderID uuid.UUID) (*uuid.UUID, float64, *string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var status string
	var userId uuid.UUID
	var totalAmount float64
	err := o.db.QueryRowContext(ctx, query.GET_ORDER_STATUS, orderID).Scan(&userId, &totalAmount, &status)
	if err != nil {
		return nil, 0, nil, err
	}
	return &userId, totalAmount, &status, nil
}

func (o *OrderRepositoryImpl) CountDelivered(productID uuid.UUID) (*int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var count int
	err := o.db.QueryRowContext(ctx, query.COUNT_DELIVERED, productID).Scan(&count)
	if err != nil {
		return &count, err
	}
	return &count, nil
}

func (o *OrderRepositoryImpl) UpdateFullAddress(address *models.UpdateAddress) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := o.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.UPDATE_ADDRESS, address.OrderID, address.FullAddress)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (o *OrderRepositoryImpl) GetSalesByMonth() (*models.MonthlyData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := o.db.QueryContext(ctx, query.GET_SALES_BY_MONTH)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var labels []string
	var data []float64

	for rows.Next() {
		var monthYear string
		var total float64

		if err := rows.Scan(&monthYear, &total); err != nil {
			return nil, err
		}

		labels = append(labels, monthYear)
		data = append(data, total)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	result := models.MonthlyData{
		Labels: labels,
		Data:   data,
	}
	return &result, nil
}

func (o *OrderRepositoryImpl) GetSalesData() (*models.SalesResponseDto, error) {
	var response models.SalesResponseDto
	var lastMonthSales float64

	err := o.db.QueryRow(`
		SELECT COALESCE(SUM(total_amount), 0)
		FROM orders
		WHERE status = 'delivered' AND DATE(created_at) = CURRENT_DATE;
	`).Scan(&response.TodaySales)
	if err != nil {
		return &response, fmt.Errorf("error fetching today_sales: %v", err)
	}

	err = o.db.QueryRow(`
		SELECT COALESCE(SUM(total_amount), 0)
		FROM orders
		WHERE status = 'delivered' AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE);
	`).Scan(&response.CurrentMonthSales)
	if err != nil {
		return &response, fmt.Errorf("error fetching current_month_sales: %v", err)
	}

	err = o.db.QueryRow(`
		SELECT COALESCE(SUM(total_amount), 0)
		FROM orders
		WHERE status = 'delivered' AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) - INTERVAL '1 month';
	`).Scan(&lastMonthSales)
	if err != nil {
		return &response, fmt.Errorf("error fetching last_month_sales: %v", err)
	}

	err = o.db.QueryRow(`
		SELECT COALESCE(SUM(total_amount), 0)
		FROM orders
		WHERE status = 'delivered';
	`).Scan(&response.TotalSales)
	if err != nil {
		return &response, fmt.Errorf("error fetching total_sales: %v", err)
	}

	if lastMonthSales > 0 {
		response.PercentageChange = ((response.CurrentMonthSales - lastMonthSales) / lastMonthSales) * 100
	} else {
		response.PercentageChange = 0
	}

	return &response, nil
}

func (o *OrderRepositoryImpl) GetOrderPaginate(page int, limit int, field string, order string, status *string, user_id *uuid.UUID) ([]models.GetOrdersPaginateDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var orders []models.GetOrdersPaginateDto
	rows, err := o.db.QueryContext(ctx, query.GET_ORDER_PAGINATE, field, order, page, limit, status, user_id)
	if err != nil {
		return orders, err
	}
	for rows.Next() {
		var order models.GetOrdersPaginateDto
		err := rows.Scan(
			&order.OrderID,
			&order.UserId,
			&order.Status,
			&order.TotalAmount,
			&order.CreatedAt,
			&order.FullAddress,
		)
		if err != nil {
			return orders, err
		}
		orders = append(orders, order)
	}
	return orders, nil
}
