package query

const (
	AddOrUpdateBasket        = `SELECT * FROM AddOrUpdateBasket($1)`
	AddOrUpdateBasketItem    = `CALL AddOrUpdateBasketItem($1,$2,$3)`
	RemoveBasketItem         = `CALL RemoveBasketItem($1,$2)`
	ClearBasketByUserId      = `CALL ClearBasketByUserId($1)`
	UpdateBasketItemQuantity = `CALL UpdateBasketItemQuantity($1,$2,$3)`
	GetBasketItemByUserID    = `SELECT bi.product_id,bi.quantity
								FROM basket_items bi
								JOIN baskets b ON bi.basket_id = b.basket_id
								WHERE b.user_id = $1
								ORDER BY bi.created_at DESC
								`
)
