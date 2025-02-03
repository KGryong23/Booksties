package server

import (
	"InventoryService/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) HandleCheckStock(c *gin.Context) {
	var req models.AddOrUpdateInventoryDto
	if err := c.ShouldBindJSON(&req); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	check, err := s.inventoryService.CheckStock(req.ProductID, req.Quantity)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	if !check {
		models.ErrorResponse(c, 301, "Warehouse is not enough")
		return
	}
	models.SuccessResponse(c, 201, "Warehouse is enough", req.ProductID)
}

func (s *Server) HandleUpdateInventory(c *gin.Context) {
	var req models.UpdateInventoryAndCreateInventoryTransactionDto
	if err := c.ShouldBindJSON(&req); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.unitofwork.UpdateInventoryAndAddTransaction(req)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Update success", req.ProductID)
}

func (s *Server) HandleGetTransactionByInventory(c *gin.Context) {
	inventoryID := c.Param("id")
	id, err := uuid.Parse(inventoryID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	data, err := s.inventoryService.GetTransactionByInventory(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", data)
}

func (s *Server) HandleGetInventoryByProdID(c *gin.Context) {
	productID := c.Param("id")
	id, err := uuid.Parse(productID)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	data, err := s.inventoryService.GetInventoryByProdID(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Get success", data)
}
