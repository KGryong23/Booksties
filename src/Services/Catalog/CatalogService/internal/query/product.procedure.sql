CREATE OR REPLACE PROCEDURE create_product(
    p_id UUID,
    p_title VARCHAR,
    p_author VARCHAR,
    p_publisher VARCHAR,
    p_publication_year INTEGER,
    p_page_count INT,
    p_dimensions VARCHAR,
    p_cover_type VARCHAR,
    p_price DECIMAL(10, 2),
    p_description TEXT,
    p_image_url VARCHAR DEFAULT NULL,
    p_product_type INT DEFAULT 1,
    p_is_active BOOLEAN DEFAULT TRUE,
    p_original_owner_id UUID DEFAULT NULL
) AS $$
BEGIN
    INSERT INTO products (
        id,
        title,
        author,
        publisher,
        publication_year,
        page_count,
        dimensions,
        cover_type,
        price,
        description,
        image_url,
        product_type, 
        is_active,
        original_owner_id
    ) VALUES (
        p_id,
        p_title,
        p_author,
        p_publisher,
        p_publication_year,
        p_page_count,
        p_dimensions,
        p_cover_type,
        p_price,
        p_description,
        p_image_url,
        p_product_type,
        p_is_active,
        p_original_owner_id
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE update_product(
    p_id UUID, 
    p_title VARCHAR,
    p_author VARCHAR,
    p_publisher VARCHAR,
    p_publication_year INTEGER,
    p_page_count INT,
    p_dimensions VARCHAR,
    p_cover_type VARCHAR,
    p_price DECIMAL(10, 2),
    p_description TEXT,
    P_image_url VARCHAR(255),
    p_discount_percentage INT,
    p_product_type INT,
    p_is_active BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET
        title = p_title,
        author = p_author,
        publisher = p_publisher,
        publication_year = p_publication_year,
        page_count = p_page_count,
        dimensions = p_dimensions,
        cover_type = p_cover_type,
        price = p_price,
        description = p_description,
        image_url = P_image_url,
        discount_percentage = p_discount_percentage,
        product_type = p_product_type,
        is_active = p_is_active,
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = p_id;

    RAISE NOTICE 'Product with ID % has been updated', p_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE 'Error updating product with ID %', p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_product(
    p_id UUID
) AS $$
BEGIN
    DELETE FROM products
    WHERE id = p_id;

    RAISE NOTICE 'Product with ID: % has been deleted.', p_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_product_genres(
    IN product_id UUID,
    IN genre_ids UUID[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    FOR i IN 1 .. array_length(genre_ids, 1) LOOP
        INSERT INTO product_genres (product_id, genre_id)
        VALUES (product_id, genre_ids[i])
        ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateSoldQuantity(
    products_json JSON
)
LANGUAGE plpgsql AS $$
DECLARE
    item JSON;
BEGIN
    FOR item IN SELECT * FROM json_array_elements(products_json)
    LOOP
        UPDATE products
        SET sold_quantity = (item->>'sold_quantity')::INT,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = (item->>'product_id')::UUID;
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateProductRatingsById(
    product_id UUID,
    new_average_rating FLOAT,
    new_quantity_evaluate INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET 
        average_rating = new_average_rating,
        quantity_evaluate = new_quantity_evaluate,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = product_id;
END;
$$;

CREATE OR REPLACE PROCEDURE update_product_genre(
    p_product_id UUID,
    p_genre_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM product_genres
    WHERE product_id = p_product_id;

    INSERT INTO product_genres (product_id, genre_id)
    VALUES (p_product_id, p_genre_id);

    RAISE NOTICE 'Updated genre for product % to %', p_product_id, p_genre_id;
END;
$$;


DROP PROCEDURE update_product

SELECT proname, proargtypes, prosrc
FROM pg_proc
WHERE proname = 'create_product';

DROP PROCEDURE create_product;

SELECT 'DROP FUNCTION ' || proname || '(' || oidvectortypes(proargtypes) || ');'
FROM pg_proc
WHERE proname = 'create_product';
