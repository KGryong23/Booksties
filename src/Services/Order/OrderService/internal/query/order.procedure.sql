-- order
CREATE OR REPLACE PROCEDURE AddOrder(
    p_order_id UUID,
    p_user_id UUID,
    p_total_amount DECIMAL(10, 2),
    p_full_address TEXT,
    p_status order_status DEFAULT 'pending'
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO orders (order_id, user_id, total_amount, status, full_address)
    VALUES (p_order_id, p_user_id, p_total_amount, p_status, p_full_address);
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateOrder(
    p_order_id UUID,
    p_status order_status,
    p_total_amount DECIMAL(10, 2)
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE orders
    SET status = p_status,
        total_amount = p_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateOrderStatus(
    p_order_id UUID,
    p_status order_status
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE orders
    SET status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
END;
$$;

CREATE OR REPLACE PROCEDURE DeleteOrder(
    p_order_id UUID
)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM orders
    WHERE order_id = p_order_id;
END;
$$;

-- order_item
CREATE OR REPLACE PROCEDURE AddOrderItems(
    p_order_id UUID,
    p_items_json JSON
)
LANGUAGE plpgsql AS $$
DECLARE
    item JSON;
BEGIN
    FOR item IN SELECT * FROM json_array_elements(p_items_json) LOOP
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (
            p_order_id,
            (item->>'product_id')::UUID,
            (item->>'quantity')::INT,
            (item->>'price')::DECIMAL(10, 2)
        );
    END LOOP;
END;
$$;


CREATE OR REPLACE PROCEDURE UpdateOrderItem(
    p_order_item_id UUID,
    p_quantity INT,
    p_price DECIMAL(10, 2)
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE order_items
    SET quantity = p_quantity,
        price = p_price,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_item_id = p_order_item_id;
END;
$$;

CREATE OR REPLACE PROCEDURE DeleteOrderItem(
    p_order_item_id UUID
)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM order_items
    WHERE order_item_id = p_order_item_id;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateOrderFullAddress(
    p_order_id UUID,
    p_full_address TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE orders
    SET 
        full_address = p_full_address,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order with ID % not found', p_order_id;
    END IF;
END;
$$;

