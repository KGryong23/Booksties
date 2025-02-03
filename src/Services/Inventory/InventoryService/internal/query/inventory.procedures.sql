-- inventory

CREATE OR REPLACE PROCEDURE AddInventory(
    p_inventory_id UUID,
    p_product_id UUID,
    p_quantity INT DEFAULT 0
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO inventory (id,product_id, quantity)
    VALUES (p_inventory_id,p_product_id, p_quantity);
END;
$$;

-- DROP PROCEDURE AddInventory;

CREATE OR REPLACE PROCEDURE UpdateInventory(
    p_product_id UUID,
    p_quantity INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE inventory
    SET quantity = p_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateInventoryList(
    p_updates JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    update_data JSON;
BEGIN
    FOR update_data IN SELECT * FROM json_array_elements(p_updates) LOOP
        UPDATE inventory
        SET quantity = (update_data->>'quantity')::INT,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = (update_data->>'product_id')::UUID;
    END LOOP;
END;
$$;


CREATE OR REPLACE PROCEDURE DeleteInventory(
    p_inventory_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM inventory
    WHERE id = p_inventory_id;
END;
$$;

CREATE OR REPLACE PROCEDURE DeleteInventoryByProdID(
    p_product_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM inventory
    WHERE product_id = p_product_id;
END;
$$;

-- inventory_transactions

CREATE OR REPLACE PROCEDURE AddInventoryTransaction(
    p_inventory_id UUID,
    p_transaction_type VARCHAR(10),
    p_quantity INT,
    p_reason TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, reason)
    VALUES (p_inventory_id, p_transaction_type, p_quantity, p_reason);
END;
$$;

CREATE OR REPLACE PROCEDURE AddInventoryTransactionList(
    p_transactions JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    transaction_data JSON;
BEGIN
    FOR transaction_data IN SELECT * FROM json_array_elements(p_transactions) LOOP
        INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, reason)
        VALUES (
            (transaction_data->>'inventory_id')::UUID,
            transaction_data->>'transaction_type',
            (transaction_data->>'quantity')::INT,
            transaction_data->>'reason'
        );
    END LOOP;
END;
$$;


CREATE OR REPLACE PROCEDURE UpdateInventoryTransaction(
    p_transaction_id UUID,
    p_transaction_type VARCHAR(10),
    p_quantity INT,
    p_reason TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE inventory_transactions
    SET transaction_type = p_transaction_type,
        quantity = p_quantity,
        reason = p_reason,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_transaction_id;
END;
$$;

CREATE OR REPLACE PROCEDURE DeleteInventoryTransaction(
    p_transaction_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM inventory_transactions
    WHERE id = p_transaction_id;
END;
$$;


