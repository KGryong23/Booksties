package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID                 uuid.UUID  `json:"id" db:"id"`                                   // Khóa chính
	Title              string     `json:"title" db:"title"`                             // Tên sách
	Author             string     `json:"author" db:"author"`                           // Tên tác giả
	Publisher          string     `json:"publisher" db:"publisher"`                     // Tên nhà xuất bản
	PublicationYear    int        `json:"publication_year" db:"publication_year"`       // Năm xuất bản
	PageCount          int        `json:"page_count" db:"page_count"`                   // Số trang
	Dimensions         string     `json:"dimensions" db:"dimensions"`                   // Kích thước sách
	CoverType          string     `json:"cover_type" db:"cover_type"`                   // Loại bìa
	Price              float64    `json:"price" db:"price"`                             // Giá sách
	Description        string     `json:"description" db:"description"`                 // Mô tả sách
	ImageURL           string     `json:"image_url" db:"image_url"`                     // URL hình ảnh
	SoldQuantity       int        `json:"sold_quantity" db:"sold_quantity"`             // Số lượng bán
	AverageRating      float64    `json:"average_rating" db:"average_rating"`           // Đánh giá trung bình
	QuantityEvaluate   int        `json:"quantity_evaluate" db:"quantity_evaluate"`     // Số lượng đánh giá
	DiscountPercentage int        `json:"discount_percentage" db:"discount_percentage"` // Mã giảm giá riêng
	ProductType        int        `json:"product_type" db:"product_type"`               // Loại sản phẩm
	IsActive           bool       `json:"is_active" db:"is_active"`                     // Trạng thái hoạt động
	OriginalOwnerID    *uuid.UUID `json:"original_owner_id" db:"original_owner_id"`     // ID của chủ sở hữu ban đầu
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`                   // Thời gian tạo
	UpdatedAt          time.Time  `json:"updated_at" db:"updated_at"`                   // Thời gian cập nhật
}
