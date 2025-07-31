CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL, 
    author VARCHAR(255), 
    publisher VARCHAR(255), 
    publication_year INTEGER, 
    page_count INT, 
    dimensions VARCHAR(50), 
    cover_type VARCHAR(50), 
    price DECIMAL(10, 2), 
    description TEXT, 
    image_url VARCHAR(255) DEFAULT NULL,
    sold_quantity INT DEFAULT 0 CHECK (sold_quantity >= 0), 
    average_rating FLOAT DEFAULT 0 CHECK (average_rating >= 0), 
    quantity_evaluate INT DEFAULT 0 CHECK (quantity_evaluate >= 0), 
    discount_percentage INT DEFAULT 0 CHECK (discount_percentage >= 0),
    product_type INT DEFAULT 1 CHECK (product_type IN (1,2)), 
    is_active BOOLEAN DEFAULT FALSE,
    original_owner_id UUID DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE product_genres (
    product_id UUID NOT NULL,
    genre_id UUID NOT NULL,
    PRIMARY KEY (product_id,genre_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);


-- CREATE TABLE inventory (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     product_id UUID REFERENCES products(id) ON DELETE CASCADE,
--     stock INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE discounts (
--     discount_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     discount_code TEXT UNIQUE NOT NULL,
--     discount_percentage INT NOT NULL,
--     apply_to_all BOOLEAN DEFAULT FALSE,
--     end_date TIMESTAMP
-- );

-- INSERT INTO products (
--     id, title, author, publisher, publication_year, page_count, dimensions, cover_type, price, description, image_url, product_type, is_active , original_owner_id
-- ) VALUES 
--     ('5A2B157F-7E72-424C-948A-35DEBEF0473D','Đắc nhân tâm', 'Dale Carnegie', 'NXB Trẻ', 1983, 215, '20x15 cm', 'Hardcover', 100000.00, 'Đắc Nhân Tâm là cuốn sách đưa ra các lời khuyên về cách thức cư xử, ứng xử và giao tiếp với mọi người để đạt được thành công trong cuộc sống', 'EC992480-CB97-4127-B410-1C1CA613B6E4.jpg', 1, TRUE,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('B5FDC90E-6853-4B9E-9EE4-2A6858586304','Nghĩ giàu làm giàu', 'Napoleon Hill', 'NXB Tổng hợp thành phố HCM', 1983, 215, '20x15 cm', 'Hardcover', 120000.00, 'Ý niệm tạo nên hiện thực, điều này hoàn toàn đúng đắn, đặc biệt là khi ý tưởng kết hợp với một mục đích đã định, nghị lực cũng như sự mong muốn biến ý tưởng thành của cải hoặc các mục tiêu khác, thì ý tưởng sẽ càng là một sự thực có đầy đủ sức mạnh.', 'A7A49A6C-FAB6-4659-8EA8-86F731172BA1.jpg', 1, TRUE ,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('3304DDD9-EBD8-4478-8586-D7A408FAFFAE','Hành động ngay', 'Thibaut Meurisse', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 130000.00, 'Hành động tức thì là một lựa chọn tốt cho bất kỳ ai muốn có một hướng dẫn thực tế và dễ tiếp cận để vượt qua sự trì hoãn và hành động theo mục tiêu của họ.', 'E603F97F-F9B3-41B7-815E-5FF9C87A01B2.jpg', 1,TRUE, '1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('3A7FC982-D4F9-49B1-9E66-DCE7CC920E6E','Phương pháp học tập Feynman', 'Âm Hồng Tín, Lý Vĩ', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 135000.00, 'Đừng lo lắng! Cuốn sách Phương Pháp Học Tập Feynman sẽ là chìa khóa giúp bạn giải quyết mọi vấn đề trên và chinh phục mọi mục tiêu học tập.', '28439981-AB7C-49F8-A150-8C2379D7133B.jpg', 1,TRUE, '1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('41476530-93EB-4016-8A50-60BA10486A48','Hiệu suất đỉnh cao', 'Thibaut Meurisse', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 145000.00, 'Cá nhân cảm thấy quá tải và kém hiệu quả: Cuốn sách hướng đến những người gặp khó khăn trong việc tập trung vào đúng nhiệm vụ và đạt được mục tiêu của họ. Nó nhấn mạnh tầm quan trọng của tư duy chiến lược để tránh làm việc bận rộn và lãng phí nỗ lực.', '0C665B40-333B-432F-B0B8-760BCCA1DE05.jpg', 1,TRUE,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('997F3456-F934-4FB3-9C96-F046FBFF1AE8','Hướng nội - Sức mạnh của sự im lặng trong một thế giới nói không ngừng', 'Susan Cain', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 149000.00, 'Hướng nội - Sức mạnh của sự im lặng trong một thế giới nói không ngừng của Susan Cain là một cuốn sách nổi tiếng khám phá sức mạnh và giá trị của người hướng nội trong một xã hội dường như ưu ái người hướng ngoại.', '17F89791-D5D7-458C-AE25-701CC0904299.jpg', 1, TRUE , '1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('CB8301DE-BD39-45EB-B58F-1BEF8F2F1B33','Muôn kiểu người chốn công sở', 'Nardia Lê', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 169000.00, 'Muôn Kiểu Người Chốn Công Sở là cẩm nang hữu ích dành cho bất kỳ ai muốn "sinh tồn" và phát triển trong môi trường công sở đầy màu sắc. Cuốn sách cung cấp cho bạn đọc cái nhìn sâu sắc về tâm lý và hành vi của các kiểu người thường gặp nơi công sở, từ lãnh đạo, nhân viên, cho đến những cá nhân nổi bật hay thậm chí là những người khó đối phó.', '99884DA6-A9CE-4E8A-A66E-44C2964E12E8.jpg', 1, TRUE , '1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('2864754C-3F5B-41DA-B811-2319B406DB8F','Đi làm đừng đi lầm', 'Ron Friedman', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 118800.00, 'ĐI LÀM ĐỪNG ĐI LẦM là cuốn sách dành cho tất cả chúng ta những người đang và sẽ tham gia vào thị trường lao động cho dù với tư cách nào đi chăng nữa.', 'BCE1F251-5E02-4D75-8436-A8C683CEB10F.jpg', 1, TRUE ,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('251D8A3A-91D5-4504-A077-8F0ECFD98D9B','Stop overthinking - Sống tự do, không âu lo', 'Chase Hill, Scott Sharp', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 218800.00, 'Cuốn sách Stop Overthinking - Sống Tự Do, Không Âu Lo: 7 Bước Loại Bỏ Suy Nghĩ Tiêu Cực và Bắt Đầu Suy Nghĩ Tích Cực chính là dành cho bạn.', 'BD4EA754-8622-4C3B-9276-9D462B16D4AF.jpg', 1, TRUE ,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37'),

--     ('FFED7C2E-EAD8-49E6-8759-F367BC351E66','One decision - Kỹ năng ra quyết định sáng suốt', 'Mike Bayer', 'NXB Dân Trí', 1983, 215, '20x15 cm', 'Hardcover', 208800.00, 'Khi bạn quyết định đọc quyển sách kỹ năng này, bạn đang thực hiện một quyết định để sống chân thực, để là chính mình. Khi quyết định sống đúng bản chất, cuộc sống của bạn sẽ thay đổi toàn diện.', '708EDCC9-9395-4560-B064-21184DE00213.jpg', 1, TRUE ,'1ebc45a3-416c-4cf4-ba26-30ab305e9f37');

    
INSERT INTO genres (
    id,name
) VALUES 
    ('8B36AF78-8953-4EE5-BAA9-B9F172439C37','Phát triển bản thân'),

    ('AF42161B-FC4F-43E5-8A0D-E9EB734246AB','Trinh thám - Kinh dị'),

    ('4A5EBB11-31DC-4222-838A-43DFB2840C46','Tài chính cá nhân'),

    ('E8D371A7-9F90-460D-8E5F-39EBE88523A1','Kinh doanh - Làm giàu'),

    ('FBEEDD4F-729C-430B-92F7-9E9B4C749504','Tư duy sáng tạo'),

    ('37288CD2-3000-4CBF-A05A-996206EFE5A6','Học tập hướng nghiệp'),

    ('09A562A1-C6A5-4368-90F1-DFBB27EFE161','Ngôn tình'),

    ('27F41B25-95C8-4CC3-9F56-EEF2A747C27D','Marketing - Bán hàng'),

    ('9C2E30E2-CD6B-457D-AF46-8373A4E2BEFB','Quản trị - Lãnh đạo'),

    ('13BF7318-119C-4F55-880D-87B38FE6D821','Tác phẩm kinh điển'),

    ('0F0A1865-5F5F-4D77-A8D1-194168784C8E','Nghệ thuật sống'),

    ('16BDDB78-1FBC-4467-B8E9-E3AD689A9BF1','Tâm linh - Tôn giáo');
    

-- INSERT INTO product_genres (
--     product_id ,genre_id
-- ) VALUES
--     ('5A2B157F-7E72-424C-948A-35DEBEF0473D','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('B5FDC90E-6853-4B9E-9EE4-2A6858586304','E8D371A7-9F90-460D-8E5F-39EBE88523A1'),

--     ('3304DDD9-EBD8-4478-8586-D7A408FAFFAE','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('3A7FC982-D4F9-49B1-9E66-DCE7CC920E6E','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('41476530-93EB-4016-8A50-60BA10486A48','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('997F3456-F934-4FB3-9C96-F046FBFF1AE8','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('CB8301DE-BD39-45EB-B58F-1BEF8F2F1B33','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('2864754C-3F5B-41DA-B811-2319B406DB8F','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('251D8A3A-91D5-4504-A077-8F0ECFD98D9B','8B36AF78-8953-4EE5-BAA9-B9F172439C37'),

--     ('FFED7C2E-EAD8-49E6-8759-F367BC351E66','8B36AF78-8953-4EE5-BAA9-B9F172439C37');

-- INSERT INTO inventory (
--     product_id ,stock
-- ) VALUES
--     ('5A2B157F-7E72-424C-948A-35DEBEF0473D',20),

--     ('B5FDC90E-6853-4B9E-9EE4-2A6858586304',20),

--     ('3304DDD9-EBD8-4478-8586-D7A408FAFFAE',20),

--     ('3A7FC982-D4F9-49B1-9E66-DCE7CC920E6E',20),

--     ('41476530-93EB-4016-8A50-60BA10486A48',20),

--     ('997F3456-F934-4FB3-9C96-F046FBFF1AE8',20),

--     ('CB8301DE-BD39-45EB-B58F-1BEF8F2F1B33',20),

--     ('2864754C-3F5B-41DA-B811-2319B406DB8F',20),

--     ('251D8A3A-91D5-4504-A077-8F0ECFD98D9B',20),

--     ('FFED7C2E-EAD8-49E6-8759-F367BC351E66',20);

-- INSERT INTO discounts (discount_code, discount_percentage,end_date) VALUES
-- ('SUMMER2024', 15, '2024-11-30 23:59:59'),

-- ('WINTER2024', 20, '2024-12-31 23:59:59'),

-- ('BACK2SCHOOL', 10, '2024-09-30 23:59:59'),

-- ('BLACKFRIDAY', 50, '2024-11-29 23:59:59'),

-- ('NEWYEAR2025', 25, '2025-01-05 23:59:59'),

-- ('SPRINGSALE', 30, '2025-03-31 23:59:59');


-- INSERT INTO product_genres (
--     product_id ,genre_id
-- ) VALUES
--   ('B5FDC90E-6853-4B9E-9EE4-2A6858586304','FBEEDD4F-729C-430B-92F7-9E9B4C749504');

