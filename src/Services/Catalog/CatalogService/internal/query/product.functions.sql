-- CREATE OR REPLACE FUNCTION PaginateProductsSold(
--     p_field VARCHAR(50) DEFAULT 'id',
--     p_order VARCHAR(4) DEFAULT 'asc',
--     p_page INT DEFAULT 1,
--     p_limit INT DEFAULT 8,
--     p_rating FLOAT DEFAULT 0,
--     p_genre_id UUID DEFAULT NULL
-- )
-- RETURNS TABLE (
--     Id UUID,
--     Title VARCHAR(255),
--     Author VARCHAR(255),
--     Price DECIMAL(10, 2),
--     ImageUrl VARCHAR(255),
--     SoldQuantity INT,
--     AverageRating FLOAT,
--     DiscountPercentage INT
-- ) 
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     RETURN QUERY EXECUTE format(
--         'SELECT 
--             p.id as Id,
--             p.title as Title,
--             p.author as Author,
--             p.price as Price,
--             p.image_url as ImageUrl,
--             p.sold_quantity as SoldQuantity,
--             p.average_rating as AverageRating,
--             p.discount_percentage as DiscountPercentage
--         FROM 
--             products p
--         %s
--         WHERE p.is_active = True AND p.product_type = 1
--         %s
--         ORDER BY p.%I %s
--         OFFSET %L ROWS 
--         FETCH NEXT %L ROWS ONLY',
--         CASE 
--             WHEN p_genre_id IS NOT NULL THEN
--                 'INNER JOIN product_genres pg ON p.id = pg.product_id AND pg.genre_id = ' || quote_literal(p_genre_id)
--             ELSE ''
--         END,
--         CASE 
--             WHEN p_rating <> 0 THEN 
--                 'AND p.average_rating >= ' || quote_literal(p_rating)
--             ELSE ''
--         END,
--         p_field, p_order, (p_page - 1) * p_limit, p_limit
--     );
-- END;
-- $$;

CREATE OR REPLACE FUNCTION unaccent_vietnamese(VARCHAR(255))
RETURNS VARCHAR(255) AS $$
BEGIN
    RETURN translate($1,
        'áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEIIIIOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- CREATE OR REPLACE FUNCTION ProductSearchPagination(
--     p_field VARCHAR(50) DEFAULT 'id',
--     p_order VARCHAR(4) DEFAULT 'asc',
--     p_page INT DEFAULT 1,
--     p_limit INT DEFAULT 8,
--     p_rating FLOAT DEFAULT 0,
--     p_search_term VARCHAR(255) DEFAULT NULL
-- )
-- RETURNS TABLE (
--     Id UUID,
--     Title VARCHAR(255),
--     Author VARCHAR(255),
--     Price DECIMAL(10, 2),
--     ImageUrl VARCHAR(255),
--     SoldQuantity INT,
--     AverageRating FLOAT,
--     DiscountPercentage INT
-- ) 
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     RETURN QUERY EXECUTE format(
--         'SELECT 
--             p.id as Id,
--             p.title as Title,
--             p.author as Author,
--             p.price as Price,
--             p.image_url as ImageUrl,
--             p.sold_quantity as SoldQuantity,
--             p.average_rating as AverageRating,
--             p.discount_percentage as DiscountPercentage
--         FROM 
--             products p
--         WHERE p.is_active = True AND p.product_type = 1
--         %s
--         %s
--         ORDER BY p.%I %s
--         OFFSET %L ROWS 
--         FETCH NEXT %L ROWS ONLY',
--         CASE 
--             WHEN p_rating <> 0 THEN 
--                 'AND p.average_rating >= ' || quote_literal(p_rating)
--             ELSE ''
--         END,
--         CASE 
--             WHEN p_search_term IS NOT NULL THEN
--                 'AND unaccent_vietnamese(p.title) ILIKE ' || quote_literal('%' || unaccent_vietnamese(p_search_term) || '%')
--             ELSE ''
--         END,
--         p_field, p_order, (p_page - 1) * p_limit, p_limit
--     );
-- END;
-- $$;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_unaccent_title ON products USING gin (unaccent_vietnamese(title) gin_trgm_ops);

-- DROP FUNCTION IF EXISTS PaginateProductsSold;

-- DROP FUNCTION IF EXISTS ProductSearchPagination;

-- DROP FUNCTION IF EXISTS unaccent_vietnamese;

-- DROP INDEX IF EXISTS idx_unaccent_title;


-- EXPLAIN ANALYZE SELECT * FROM products WHERE unaccent_vietnamese(title) ILIKE '%dacnhantam%';

-- SELECT unaccent_vietnamese('Đắc nhân tâm');

-- SELECT * FROM products 
-- WHERE unaccent_vietnamese(title) ILIKE '%' || unaccent_vietnamese('Đac nhan tam') || '%';

CREATE OR REPLACE FUNCTION UnifiedProductPagination(
    p_field VARCHAR(50) DEFAULT 'id',
    p_order VARCHAR(4) DEFAULT 'asc',
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 8,
    p_rating FLOAT DEFAULT 0,
    p_genre_id UUID DEFAULT NULL,
    p_search_term VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE (
    Id UUID,
    Title VARCHAR(255),
    Author VARCHAR(255),
    Publisher VARCHAR(255),
    PublicationYear INTEGER,
    PageCount INT,
    Dimensions VARCHAR(50),
    CoverType VARCHAR(50),
    Price DECIMAL(10, 2),
    Description TEXT,
    ImageUrl VARCHAR(255),
    SoldQuantity INT,
    AverageRating FLOAT,
    QuantityEvaluate INT,
    DiscountPercentage INT,
    ProductType INT,
    IsActive BOOLEAN,
    OriginalOwnerId UUID,
    CreatedAt TIMESTAMP WITH TIME ZONE,
    UpdatedAt TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT 
            p.id as Id,
            p.title as Title,
            p.author as Author,
            p.publisher as Publisher,
            p.publication_year as PublicationYear,
            p.page_count as PageCount,
            p.dimensions as Dimensions,
            p.cover_type as CoverType,
            p.price as Price,
            p.description as Description,
            p.image_url as ImageUrl,
            p.sold_quantity as SoldQuantity,
            p.average_rating as AverageRating,
            p.quantity_evaluate as QuantityEvaluate,
            p.discount_percentage as DiscountPercentage,
            p.product_type as ProductType,
            p.is_active as IsActive,
            p.original_owner_id as OriginalOwnerId,
            p.created_at as CreatedAt,
            p.updated_at as UpdatedAt
        FROM 
            products p
        WHERE p.product_type = 1
        %s
        %s
        %s
        ORDER BY p.%I %s
        OFFSET %L ROWS 
        FETCH NEXT %L ROWS ONLY',
        
        CASE 
            WHEN p_genre_id IS NOT NULL THEN
                'INNER JOIN product_genres pg ON p.id = pg.product_id AND pg.genre_id = ' || quote_literal(p_genre_id)
            ELSE ''
        END,
        
        CASE 
            WHEN p_rating <> 0 THEN 
                'AND p.average_rating >= ' || quote_literal(p_rating)
            ELSE ''
        END,
        
        CASE 
            WHEN p_search_term IS NOT NULL THEN
                'AND unaccent_vietnamese(p.title) ILIKE ' || quote_literal('%' || unaccent_vietnamese(p_search_term) || '%')
            ELSE ''
        END,
        p_field, p_order, (p_page - 1) * p_limit, p_limit
    );
END;
$$;


DROP FUNCTION IF EXISTS UnifiedProductPagination;