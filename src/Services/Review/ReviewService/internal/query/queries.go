package query

const (
	ADD_OR_UPDATE           = `CALL AddOrUpdateReview($1,$2,$3,$4,$5)`
	DELETE_REVIEW           = `CALL DeleteReview($1,$2)`
	AVG_RATING_TOTAL_REVIEW = `SELECT 
								  AVG(rating) AS average_rating,
								  COUNT(review_id) AS review_count
							   FROM 
								  reviews
							   WHERE 
								  product_id = $1
							   `
	GET_REVIEW_BY_PROD_ID = `SELECT review_id,username,rating,comment,updated_at
	                         FROM reviews
							 WHERE product_id = $1
							 ORDER BY created_at asc
	                        `
)
