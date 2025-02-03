CREATE OR REPLACE PROCEDURE AddOrUpdateReview(
    p_product_id UUID,
    p_user_id UUID,
    p_username VARCHAR(255),
    p_rating INT,
    p_comment TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM reviews WHERE product_id = p_product_id AND user_id = p_user_id) THEN
        UPDATE reviews
        SET
            username = p_username,
            rating = p_rating,
            comment = p_comment,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = p_product_id AND user_id = p_user_id;
    ELSE
        INSERT INTO reviews (product_id, user_id, username, rating, comment)
        VALUES (p_product_id, p_user_id,p_username ,p_rating, p_comment);
    END IF;
END;
$$;


CREATE OR REPLACE PROCEDURE DeleteReview(
    p_product_id UUID,
    p_user_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM reviews
    WHERE product_id = p_product_id AND user_id = p_user_id;
END;
$$;

DROP PROCEDURE AddOrUpdateReview
