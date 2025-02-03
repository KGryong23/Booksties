CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),               
    product_id UUID NOT NULL UNIQUE,      
    quantity INT NOT NULL DEFAULT 0,      
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('IN', 'OUT')), 
    quantity INT NOT NULL,
    reason TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


