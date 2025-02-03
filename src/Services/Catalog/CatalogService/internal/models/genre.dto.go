package models

import "github.com/google/uuid"

type GenreDto struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type UpdateProductGenre struct {
	GenreID   uuid.UUID `json:"genre_id"`
	ProductID uuid.UUID `json:"product_id"`
}
