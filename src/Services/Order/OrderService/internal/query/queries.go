package query

const (
	CREATE_ORDER          = `CALL AddOrder($1, $2, $3, $4)`
	CREATE_ORDER_ITEMS    = `CALL AddOrderItems($1, $2::json)`
	DELETE_ORDER          = `CALL DeleteOrder($1)`
	UPDATE_ADDRESS        = `CALL UpdateOrderFullAddress($1,$2)`
	GET_ORDERS_BY_USER_ID = `SELECT o.order_id, o.status, o.total_amount, o.created_at,o.full_address, 
                                    oi.product_id, oi.quantity, oi.price
							 FROM orders o 
							 INNER JOIN order_items oi ON o.order_id = oi.order_id
							 WHERE o.user_id = $1
							 ORDER BY o.created_at DESC
                            `
	GET_ORDER_ITEM_LIST = `SELECT product_id,quantity,price
						   FROM order_items
						   WHERE order_id = $1
	                      `
	GET_ORDER_STATUS = `SELECT user_id, total_amount ,status
						FROM orders
						WHERE order_id = $1`
	COUNT_DELIVERED = `SELECT 
                         SUM(oi.quantity) AS total_quantity_sold
					   FROM 
						 orders o
					   JOIN 
						 order_items oi ON o.order_id = oi.order_id
					   WHERE 
						 o.status = 'delivered'
						 AND oi.product_id = $1

                       `
	UPDATE_ORDER_STATUS = `CALL UpdateOrderStatus($1,$2)`

	GET_SALES_BY_MONTH = `
	                  WITH months AS (
							SELECT 
								to_char(month_start, 'TMMonth YYYY') AS month_year,
								month_start
							FROM generate_series(
								date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
								date_trunc('month', CURRENT_DATE),
								'1 month'
							) AS month_start
						)
						SELECT 
							m.month_year,
							COALESCE(SUM(o.total_amount), 0) AS total
						FROM months m
						LEFT JOIN orders o
							ON date_trunc('month', o.created_at) = m.month_start
							AND o.status = 'delivered'
						GROUP BY m.month_year, m.month_start
						ORDER BY m.month_start;
	               `
	GET_ORDER_PAGINATE = `SELECT * FROM UnifiedOrdersPagination($1,$2,$3,$4,$5,$6);`
)
