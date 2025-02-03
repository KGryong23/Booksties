CREATE OR REPLACE FUNCTION AddOrUpdateBasket(
    p_user_id UUID
) 
RETURNS UUID
LANGUAGE plpgsql AS $$
DECLARE
    v_basket_id UUID;
BEGIN
    SELECT basket_id INTO v_basket_id
    FROM baskets
    WHERE user_id = p_user_id;

    IF v_basket_id IS NOT NULL THEN
        UPDATE baskets
        SET updated_at = CURRENT_TIMESTAMP
        WHERE basket_id = v_basket_id;
    ELSE
        v_basket_id := gen_random_uuid();
        INSERT INTO baskets (basket_id, user_id)
        VALUES (v_basket_id, p_user_id);
    END IF;

    RETURN v_basket_id;
END;
$$;


CREATE OR REPLACE PROCEDURE AddOrUpdateBasketItem(
    p_basket_id UUID,
    p_product_id UUID,
    p_quantity INT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM basket_items WHERE basket_id = p_basket_id AND product_id = p_product_id) THEN
        UPDATE basket_items
        SET 
            quantity = quantity + p_quantity
        WHERE basket_id = p_basket_id AND product_id = p_product_id;
    ELSE
        INSERT INTO basket_items (basket_id, product_id, quantity)
        VALUES (p_basket_id, p_product_id, p_quantity);
    END IF;
END;
$$;


CREATE OR REPLACE PROCEDURE RemoveBasketItem(
    p_user_id UUID,
    p_product_id UUID
)
LANGUAGE plpgsql AS $$
DECLARE
    v_basket_id UUID;
BEGIN
    SELECT basket_id INTO v_basket_id
    FROM baskets
    WHERE user_id = p_user_id;

    IF v_basket_id IS NULL THEN
        RAISE EXCEPTION 'Basket not found for user_id: %', p_user_id;
    END IF;

    DELETE FROM basket_items
    WHERE basket_id = v_basket_id AND product_id = p_product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found in basket for user_id: %, product_id: %', p_user_id, p_product_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE ClearBasketByUserId(
    p_user_id UUID
)
LANGUAGE plpgsql AS $$
DECLARE
    v_basket_id UUID;
BEGIN
    SELECT basket_id INTO v_basket_id
    FROM baskets
    WHERE user_id = p_user_id;

    IF v_basket_id IS NULL THEN
        RAISE EXCEPTION 'Basket not found for user_id %', p_user_id;
    END IF;

    DELETE FROM basket_items
    WHERE basket_id = v_basket_id;

    RAISE NOTICE 'All items cleared from basket % for user_id %', v_basket_id, p_user_id;
END;
$$;


CREATE OR REPLACE PROCEDURE UpdateBasketItemQuantity(
    p_user_id UUID,
    p_product_id UUID,
    p_quantity INT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_basket_id UUID;
BEGIN
    SELECT basket_id INTO v_basket_id
    FROM baskets
    WHERE user_id = p_user_id;

    IF v_basket_id IS NULL THEN
        RAISE EXCEPTION 'Basket not found for user_id: %', p_user_id;
    END IF;

    UPDATE basket_items
    SET quantity = p_quantity
    WHERE basket_id = v_basket_id AND product_id = p_product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found in basket for user_id: %, product_id: %', p_user_id, p_product_id;
    END IF;
END;
$$;

DROP PROCEDURE IF EXISTS AddOrUpdateBasketItem(UUID, UUID,INT,float);
