CREATE OR REPLACE FUNCTION UnifiedOrdersPagination(
    p_field VARCHAR(50) DEFAULT 'created_at', 
    p_order VARCHAR(4) DEFAULT 'desc',       
    p_page INT DEFAULT 1,                     
    p_limit INT DEFAULT 5,                   
    p_status order_status DEFAULT NULL,       
    p_user_id UUID DEFAULT NULL            
)
RETURNS TABLE (
    OrderID UUID,
    UserID UUID,
    Status order_status,
    TotalAmount DECIMAL(10, 2),
    CreatedAt TIMESTAMP,
    full_address TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT 
            o.order_id AS OrderID,
            o.user_id AS UserID,
            o.status AS Status,
            o.total_amount AS TotalAmount,
            o.created_at AS CreatedAt,
            o.full_address as FullAddress
        FROM 
            orders o
        WHERE 
            1 = 1
            %s
            %s
        ORDER BY o.%I %s
        OFFSET %L ROWS
        FETCH NEXT %L ROWS ONLY',
        
        CASE 
            WHEN p_status IS NOT NULL THEN 
                'AND o.status = ' || quote_literal(p_status)
            ELSE ''
        END,
        
        CASE 
            WHEN p_user_id IS NOT NULL THEN 
                'AND o.user_id = ' || quote_literal(p_user_id)
            ELSE ''
        END,
        
        p_field, 
        p_order, 
        
        (p_page - 1) * p_limit, 
        p_limit
    );
END;
$$;
