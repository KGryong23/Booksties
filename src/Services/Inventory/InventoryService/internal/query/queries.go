package query

const (
	// inventory
	CREATE_INVENTORY         = `CALL AddInventory($1,$2,$3)`
	UPDATE_INVENTORY         = `CALL UpdateInventory($1,$2)`
	UPDATE_INVENTORY_LIST    = `CALL UpdateInventoryList($1::json)`
	DELETE_INVENTORY         = `CALL DeleteInventory($1)`
	DELETE_INVENTORY_PROD_ID = `CALL DeleteInventoryByProdID($1)`
	GET_INVENTORY            = `SELECT id,product_id,quantity
	                            FROM inventory
						        WHERE product_id = $1
	                           `
	// inventory_transactions
	CREATE_INVENTORY_TRANSACTIONS      = `CALL AddInventoryTransaction($1,$2,$3,$4)`
	CREATE_INVENTORY_TRANSACTIONS_LIST = `CALL AddInventoryTransactionList($1::json)`
	UPDATE_INVENTORY_TRANSACTIONS      = `CALL UpdateInventoryTransaction($1,$2,$3,$4)`
	DELETE_INVENTORY_TRANSACTIONS      = `CALL DeleteInventoryTransaction($1)`
	GET_TRANSACTIONS                   = `SELECT 
											id AS transaction_id,
											transaction_type,
											quantity,
											reason,
											created_at
										  FROM 
											inventory_transactions
										  WHERE 
											inventory_id = $1
										  ORDER BY 
											created_at DESC`
)
