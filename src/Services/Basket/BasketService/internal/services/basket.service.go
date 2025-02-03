package services

import (
	"BasketService/internal/models"
	"BasketService/internal/repositories"

	"github.com/google/uuid"
)

type BasketService interface {
	RemoveBasketItem(basketItem *models.RemoveBasketItemDto) error
	ClearBasketByUserId(userId uuid.UUID) error
	UpdateBasketItemQuantity(basketItem *models.UpdateBasketItemQuantityDto) error
	GetBasketItemsByUserId(userId uuid.UUID) (*[]models.GetBasketItemsDto, error)
}

type BasketServiceImpl struct {
	BasketRepo repositories.BasketRepository
}

func NewBasketService(BasketRepo repositories.BasketRepository) BasketService {
	return &BasketServiceImpl{
		BasketRepo: BasketRepo,
	}
}

func (b *BasketServiceImpl) RemoveBasketItem(basketItem *models.RemoveBasketItemDto) error {
	return b.BasketRepo.RemoveBasketItem(basketItem)
}
func (b *BasketServiceImpl) ClearBasketByUserId(userId uuid.UUID) error {
	return b.BasketRepo.ClearBasketByUserId(userId)
}
func (b *BasketServiceImpl) UpdateBasketItemQuantity(basketItem *models.UpdateBasketItemQuantityDto) error {
	return b.BasketRepo.UpdateBasketItemQuantity(basketItem)
}
func (b *BasketServiceImpl) GetBasketItemsByUserId(userId uuid.UUID) (*[]models.GetBasketItemsDto, error) {
	return b.BasketRepo.GetBasketItemsByUserId(userId)
}
