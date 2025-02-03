package tests

import (
	"CatalogService/internal/repositories"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetProductById(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositories.NewProductRepository(db)

	productID := uuid.New()
	imageURL := "https://example.com/image.jpg"
	query := "SELECT id, title, author, publisher, publication_year, page_count, dimensions, cover_type, price, description, image_url, sold_quantity, average_rating, quantity_evaluate, discount_percentage, product_type, is_active, original_owner_id, created_at, updated_at FROM products WHERE id = \\$1"

	rows := sqlmock.NewRows([]string{
		"id", "title", "author", "publisher", "publication_year", "page_count", "dimensions",
		"cover_type", "price", "description", "image_url", "sold_quantity", "average_rating",
		"quantity_evaluate", "discount_percentage", "product_type", "is_active", "original_owner_id",
		"created_at", "updated_at",
	}).AddRow(
		productID, "Example Book", "Author Name", "Publisher Name", 2023, 300, "8.5x11",
		"Hardcover", 19.99, "Description here", imageURL, 100, 4.5,
		20, 10.0, 1, true, uuid.New(), time.Now(), time.Now(),
	)

	mock.ExpectQuery(query).WithArgs(productID).WillReturnRows(rows)

	product, err := repo.GetProductById(productID)

	assert.NoError(t, err)
	assert.NotNil(t, product)
	assert.Equal(t, productID, product.ID)
	assert.Equal(t, "Example Book", product.Title)
	assert.Equal(t, "Author Name", product.Author)
	assert.Equal(t, imageURL, product.ImageURL)

	assert.NoError(t, mock.ExpectationsWereMet())
}
