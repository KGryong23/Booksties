package server

import (
	"OrderService/internal/models"
	protos "OrderService/internal/protos/pd"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) CreateOrdersAndOrderItemHandler(c *gin.Context) {
	var dto models.CreateOrderAndOrderItemDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	productQuantitys := handleProductQuantity(dto.OrderItems)
	if len(productQuantitys) == 0 {
		models.ErrorResponse(c, 301, "Cannot convert")
		return
	}
	checkQuantity, err := s.HandleCheckFromStock(productQuantitys)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if len(checkQuantity.InsufficientStockProductIds) > 0 {
		models.SuccessResponse(c, 301, "Warehouse is not enough", checkQuantity.InsufficientStockProductIds)
		return
	}
	id, err := s.unitofwork.CreateOrderAndOrderItems(&dto)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err = s.sendMessageWithRetry("basket", models.MqBasketDeleteDto{UserID: dto.UserID})
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err = s.sendMessageWithRetry("identity_pay", models.PayOrder{
		UserId:      dto.UserID,
		OrderAmount: dto.TotalAmount,
		Description: "Thanh toán đơn hàng",
	})
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Create success", id)
}

func (s *Server) CreateOrderAndOrderItemHandler(c *gin.Context) {
	var dto models.CreateOrderAndOrderItemDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	productQuantitys := handleProductQuantity(dto.OrderItems)
	if len(productQuantitys) == 0 {
		models.ErrorResponse(c, 301, "Cannot convert")
		return
	}
	checkQuantity, err := s.HandleCheckFromStock(productQuantitys)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if len(checkQuantity.InsufficientStockProductIds) > 0 {
		models.SuccessResponse(c, 301, "Warehouse is not enough", checkQuantity.InsufficientStockProductIds)
		return
	}
	id, err := s.unitofwork.CreateOrderAndOrderItems(&dto)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err = s.sendMessageWithRetry("identity_pay", models.PayOrder{
		UserId:      dto.UserID,
		OrderAmount: dto.TotalAmount,
		Description: "Thanh toán đơn hàng",
	})
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Create success", id)
}

func (s *Server) DeleteOrderHandler(c *gin.Context) {
	orderID := c.Param("id")
	id, err := uuid.Parse(orderID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	err = s.orderService.DeleteOrder(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Delete success", id)
}

func (s *Server) HandleGetOrdersByUserId(c *gin.Context) {
	userID := c.Param("id")
	id, err := uuid.Parse(userID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	orders, err := s.orderService.GetOdersByUserId(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	ids := uniqueProductID(orders)
	if len(ids) <= 0 {
		models.ErrorResponse(c, 301, "Empty!!!")
		return
	}
	resp, err := s.HandleGetProductsFromCatalog(ids)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	prodMap := converToMap(resp)
	data := handleMergeData(orders, prodMap)
	if data == nil {
		models.ErrorResponse(c, 301, "Failed merge")
		return
	}
	models.SuccessResponse(c, 201, "Get orders success", data)
}

func (s *Server) HandleGetOrderByOrderId(c *gin.Context) {
	orderID := c.Param("id")
	id, err := uuid.Parse(orderID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	data, err := s.orderService.GetOrderItemsList(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	ids := uniqueProductID_1(data)
	if len(ids) <= 0 {
		models.ErrorResponse(c, 301, "Empty!!!")
		return
	}
	resp, err := s.HandleGetProductsFromCatalog(ids)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	prodMap := converToMap(resp)
	orders := handleMergeData_1(data, prodMap)
	if orders == nil {
		models.ErrorResponse(c, 301, "Failed merge")
		return
	}
	models.SuccessResponse(c, 201, "Get orders success", orders)
}

func (s *Server) HandleUpdateOrderStatus(c *gin.Context) {
	var order models.UpdateOrderDto
	if err := c.ShouldBindJSON(&order); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	userId, totalAmount, status, err := s.orderService.GetOrderStatus(order.OrderID)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if !handleStatus(status, order.Status) {
		models.ErrorResponse(c, 301, "The order has been processed")
		return
	}
	if order.Status == "cancelled" {
		err := s.sendMessageWithRetry("identity_refund", models.RefundTransaction{
			UserId:       *userId,
			RefundAmount: totalAmount,
			Description:  "Hoàn tiền hủy đơn",
		})
		if err != nil {
			models.ErrorResponse(c, 301, err.Error())
			return
		}
	}
	err = s.orderService.UpdateOrderStatus(&order)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if *status == "pending" && order.Status == "cancelled" {
		models.SuccessResponse(c, 201, "Update orders success", order.OrderID)
		return
	}
	if order.Status == "delivered" {
		solds, err := s.orderService.GetCountDelivered(order.OrderID)
		if err == nil {
			s.sendMessageWithRetry("catalog", solds)
		}
		models.SuccessResponse(c, 201, "Update orders success", order.OrderID)
		return
	}
	orderItems, err := s.orderService.GetOrderItemsList(order.OrderID)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	inventorys := handleOrderToInventory(orderItems, order.Status)
	if len(inventorys) > 0 {
		err = s.sendMessageWithRetry("inventory", inventorys)
		if err != nil {
			models.ErrorResponse(c, 301, err.Error())
			return
		}
	}
	models.SuccessResponse(c, 201, "Update orders success", order.OrderID)
}

func (s *Server) HandleOrderCancell(c *gin.Context) {
	var order models.UpdateOrderDto
	if err := c.ShouldBindJSON(&order); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	userId, totalAmount, status, err := s.orderService.GetOrderStatus(order.OrderID)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if *status != "pending" {
		models.ErrorResponse(c, 301, "The order has been processed")
		return
	}
	if !handleStatus(status, order.Status) {
		models.ErrorResponse(c, 301, "The order has been processed")
		return
	}
	if order.Status == "cancelled" {
		err := s.sendMessageWithRetry("identity_refund", models.RefundTransaction{
			UserId:       *userId,
			RefundAmount: totalAmount,
			Description:  "Hoàn tiền hủy đơn",
		})
		if err != nil {
			models.ErrorResponse(c, 301, err.Error())
			return
		}
	}
	err = s.orderService.UpdateOrderStatus(&order)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Order cancell success", order.OrderID)
}

func (s *Server) HandleUpdateAddress(c *gin.Context) {
	var address models.UpdateAddress
	if err := c.ShouldBindJSON(&address); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.orderService.UpdateFullAddress(&address)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Update address success", address.OrderID)
}

func uniqueProductID(data []models.GetOrdersAndOrderItemsDto) []string {
	orderMap := make(map[string]bool)
	var productIDS []string
	for _, ids := range data {
		for _, id := range ids.OrderItems {
			if !orderMap[id.ProductID.String()] {
				orderMap[id.ProductID.String()] = true
				productIDS = append(productIDS, id.ProductID.String())
			}
		}
	}
	return productIDS
}

func uniqueProductID_1(data []models.GetOrderItemListDto) []string {
	var productIDS []string
	for _, ids := range data {
		productIDS = append(productIDS, ids.ProductID.String())
	}
	return productIDS
}

func converToMap(resp *protos.ProductOrderList) map[string]*protos.ProductOrder {
	productMap := make(map[string]*protos.ProductOrder)
	for _, product := range resp.Products {
		productMap[product.Id] = product
	}
	return productMap
}

func handleMergeData(
	orders []models.GetOrdersAndOrderItemsDto,
	prodMap map[string]*protos.ProductOrder,
) []models.GetOrdersAndOrderItemsDetailDto {
	var orderDetails []models.GetOrdersAndOrderItemsDetailDto
	for _, order := range orders {
		var orderDetail = models.GetOrdersAndOrderItemsDetailDto{
			GetOrdersDto: order.GetOrdersDto,
		}
		for _, orderItem := range order.OrderItems {
			var product *protos.ProductOrder
			if _, ok := prodMap[orderItem.ProductID.String()]; ok {
				product = prodMap[orderItem.ProductID.String()]
			} else {
				product = &protos.ProductOrder{
					Id:       orderItem.ProductID.String(),
					Title:    "Sản phẩm đã bị xóa",
					Author:   ".....",
					ImageUrl: "",
				}
			}
			orderDetail.OrderItems = append(orderDetail.OrderItems, models.GetOrderItemsDetailDto{
				ID:       uuid.MustParse(product.Id),
				Title:    product.Title,
				Author:   product.Author,
				ImageURL: &product.ImageUrl,
				Quantity: orderItem.Quantity,
				Price:    orderItem.Price,
			})
		}
		orderDetails = append(orderDetails, orderDetail)
	}
	return orderDetails
}

func handleMergeData_1(items []models.GetOrderItemListDto, prodMap map[string]*protos.ProductOrder) []models.GetOrderItemsDetailDto {
	var orderItems []models.GetOrderItemsDetailDto
	for _, item := range items {
		if _, ok := prodMap[item.ProductID.String()]; ok {
			product := prodMap[item.ProductID.String()]
			orderItems = append(orderItems, models.GetOrderItemsDetailDto{
				ID:       uuid.MustParse(product.Id),
				Author:   product.Author,
				Title:    product.Title,
				ImageURL: &product.ImageUrl,
				Quantity: item.Quantity,
				Price:    item.Price,
			})
		}
	}
	return orderItems
}

func handleOrderToInventory(orderItems []models.GetOrderItemListDto, action string) []models.UpdateInventoryAndCreateInventoryTransactionDto {
	transactionType, reason := getTransactionDetails(action)
	if transactionType == "" {
		return nil
	}
	var inventorys []models.UpdateInventoryAndCreateInventoryTransactionDto
	for _, orderItem := range orderItems {
		inventorys = append(inventorys, models.UpdateInventoryAndCreateInventoryTransactionDto{
			ProductID:       orderItem.ProductID,
			TransactionType: transactionType,
			Quantity:        orderItem.Quantity,
			Reason:          reason,
		})
	}
	return inventorys
}

func getTransactionDetails(action string) (transactionType, reason string) {
	switch action {
	case "shipped":
		return "OUT", "Giao hàng"
	case "cancelled":
		return "IN", "Đơn hàng bị hủy"
	default:
		return "", ""
	}
}

func handleStatus(status *string, action string) bool {
	validTransitions := map[string][]string{
		"pending":   {"shipped", "cancelled"},
		"shipped":   {"delivered", "cancelled"},
		"delivered": {"cancelled"},
	}

	validActions, exists := validTransitions[*status]

	if !exists {
		return false
	}

	for _, validAction := range validActions {
		if action == validAction {
			return true
		}
	}

	return false
}

func handleProductQuantity(orderItems []models.CreateOrderItem) []*protos.ProductQuantity {
	var productQuantitys []*protos.ProductQuantity
	for _, order := range orderItems {
		productQuantitys = append(productQuantitys, &protos.ProductQuantity{
			ProductId: order.ProductID.String(),
			Quantity:  int32(order.Quantity),
		})
	}
	return productQuantitys
}

func (s *Server) GetSalesByMonth(c *gin.Context) {
	data, err := s.orderService.GetSalesByMonth()
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", data)
}

func (s *Server) GetSalesData(c *gin.Context) {
	data, err := s.orderService.GetSalesData()
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", data)
}

func (s *Server) HandleGetOrderPaginate(c *gin.Context) {
	field := c.DefaultQuery("field", "created_at")
	order := c.DefaultQuery("order", "desc")
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid page")
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid limit")
		return
	}

	userID := c.Query("user_id")
	var userUUID *uuid.UUID
	if userID != "" && userID != "empty" {
		parsedUserID, err := uuid.Parse(userID)
		if err != nil {
			models.ErrorResponse(c, 301, "Invalid user ID")
			return
		}
		userUUID = &parsedUserID
	} else {
		userUUID = nil
	}

	status := c.Query("status")
	status = strings.TrimSuffix(status, "?")
	var searchString *string
	if status != "" && status != "empty" {
		searchString = &status
	} else {
		searchString = nil
	}
	orders, err := s.orderService.GetOrderPaginate(
		page,
		limit,
		field,
		order,
		searchString,
		userUUID,
	)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.PaginateResponse(c, 201, "Get list products success", page, limit, len(orders), orders)
}

func (s *Server) HandleGetOrderPaginateWithUser(c *gin.Context) {
	var res models.MqBasketDeleteDto
	if err := c.ShouldBindJSON(&res); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}

	field := c.DefaultQuery("field", "created_at")
	order := c.DefaultQuery("order", "desc")
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid page")
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if err != nil {
		models.ErrorResponse(c, 301, "Invalid limit")
		return
	}

	orders, err := s.orderService.GetOrderPaginate(
		page,
		limit,
		field,
		order,
		nil,
		&res.UserID,
	)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.PaginateResponse(c, 201, "Get list products success", page, limit, len(orders), orders)
}
