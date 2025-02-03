package server

import (
	"BasketService/internal/models"
	protos "BasketService/internal/protos/pd"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) HandleCreateBasketAndBasketItem(c *gin.Context) {
	var dto models.CreateBasketItemDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.unitofwork.CreateBasketAndBasketItem(&dto)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Create success", dto.UserID)
}

func (s *Server) HandleRemoveBasketItem(c *gin.Context) {
	var dto models.RemoveBasketItemDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.basketService.RemoveBasketItem(&dto)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Remove success", dto.UserID)
}

func (s *Server) HandleClearBasketByUserId(c *gin.Context) {
	userId := c.Param("id")
	id, err := uuid.Parse(userId)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	err = s.basketService.ClearBasketByUserId(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Clear success", id)
}

func (s *Server) HandleUpdateBasketItemQuantity(c *gin.Context) {
	var dto models.UpdateBasketItemQuantityDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	err := s.basketService.UpdateBasketItemQuantity(&dto)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	models.SuccessResponse(c, 201, "Update success", dto.UserID)
}

func (s *Server) HandleGetBasketItemsByUserId(c *gin.Context) {
	userId := c.Param("id")
	id, err := uuid.Parse(userId)
	if err != nil {
		models.ErrorResponse(c, 301, "Parameter is invalid")
		return
	}
	data, err := s.basketService.GetBasketItemsByUserId(id)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	productIDS, basketMap := handleGetProductIDSAndMap(data)
	if len(productIDS) <= 0 {
		models.ErrorResponse(c, 301, "Empty")
		return
	}
	res, err := s.HandleGetProductsFromCatalog(productIDS)
	if err != nil {
		models.ErrorResponse(c, 301, err.Error())
		return
	}
	products := handleMergeData(res, basketMap)
	models.SuccessResponse(c, 201, "Get success", products)
}

// func (s *Server) HandleConvertingBasketIntoOrder(c *gin.Context) {
// 	var req models.MqOrderAndOrderItemDto
// 	err := c.ShouldBindJSON(&req)
// 	if err != nil {
// 		models.ErrorResponse(c, 301, err.Error())
// 		return
// 	}
// 	err = s.sendMessageWithRetry(req)
// 	if err != nil {
// 		models.ErrorResponse(c, 301, err.Error())
// 		return
// 	}
// 	err = s.basketService.ClearBasketByUserId(req.UserID)
// 	if err != nil {
// 		models.ErrorResponse(c, 301, err.Error())
// 		return
// 	}
// 	models.SuccessResponse(c, 201, "Convert success", req.UserID)
// }

func handleGetProductIDSAndMap(data *[]models.GetBasketItemsDto) ([]string, map[string]int) {
	basketMap := make(map[string]int)
	var productIDS []string
	for _, product := range *data {
		productIDS = append(productIDS, product.ProductID.String())
		basketMap[product.ProductID.String()] = product.Quantity
	}
	return productIDS, basketMap
}

func handleMergeData(products *protos.ProductBasketList, basketMap map[string]int) *[]models.GetBasketItemsDetailDto {
	var combinedDetails []models.GetBasketItemsDetailDto
	for _, product := range products.Products {
		if quantity, exists := basketMap[product.Id]; exists {
			detail := models.GetBasketItemsDetailDto{
				ID:                 uuid.MustParse(product.Id),
				Title:              product.Title,
				Author:             product.Author,
				DiscountPercentage: int(product.DiscountPercentage),
				Quantity:           quantity,
				Price:              float64(product.Price),
			}

			if product.ImageUrl != "" {
				detail.ImageURL = &product.ImageUrl
			}

			combinedDetails = append(combinedDetails, detail)
		}
	}
	return &combinedDetails
}
