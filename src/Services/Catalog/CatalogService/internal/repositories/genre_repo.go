package repositories

import (
	"CatalogService/internal/models"
	"CatalogService/internal/query"
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type GenreRepository interface {
	CreateGenres(tx *sql.Tx, productID uuid.UUID, genreIDs uuid.UUIDs) error
	GetGenres() (*[]models.GenreDto, error)
	GetGenreByProduct(id uuid.UUID) (*models.GenreDto, error)
	UpdateProductGenre(productID uuid.UUID, genreID uuid.UUID) error
}

type GenreRepositoryImpl struct {
	db *sql.DB
}

func NewGenreRepository(db *sql.DB) GenreRepository {
	return &GenreRepositoryImpl{
		db: db,
	}
}

func (g *GenreRepositoryImpl) CreateGenres(tx *sql.Tx, productID uuid.UUID, genreIDs uuid.UUIDs) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := tx.ExecContext(ctx, query.CREATE_GENRES, productID, pq.Array(genreIDs))
	if err != nil {
		return fmt.Errorf("error executing procedure: %v", err)
	}
	return nil
}

func (g *GenreRepositoryImpl) GetGenres() (*[]models.GenreDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	rows, err := g.db.QueryContext(ctx, query.GET_GENRES)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var genres []models.GenreDto
	for rows.Next() {
		var genre models.GenreDto
		err := rows.Scan(&genre.ID, &genre.Name)
		if err != nil {
			return nil, err
		}
		genres = append(genres, genre)
	}
	return &genres, nil
}

func (g *GenreRepositoryImpl) GetGenreByProduct(id uuid.UUID) (*models.GenreDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var data models.GenreDto
	err := g.db.QueryRowContext(ctx, query.GET_GENRES_BY_PRODUCT, id).Scan(
		&data.ID,
		&data.Name,
	)
	if err != nil {
		return nil, err
	}
	return &data, nil
}
func (g *GenreRepositoryImpl) UpdateProductGenre(productID uuid.UUID, genreID uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := g.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, query.UPDATE_PRODUCT_GENRE, productID, genreID)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}
