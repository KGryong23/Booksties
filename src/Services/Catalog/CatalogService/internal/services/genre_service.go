package services

import (
	"CatalogService/internal/models"
	"CatalogService/internal/repositories"

	"github.com/google/uuid"
)

type GenreService interface {
	GetGenres() (*[]models.GenreDto, error)
	GetGenreByProduct(id uuid.UUID) (*models.GenreDto, error)
	UpdateProductGenre(productID uuid.UUID, genreID uuid.UUID) error
}

type GenreServiceImpl struct {
	genreRepo repositories.GenreRepository
}

func NewGenreService(genreRepo repositories.GenreRepository) GenreService {
	return &GenreServiceImpl{
		genreRepo: genreRepo,
	}
}

func (g *GenreServiceImpl) GetGenres() (*[]models.GenreDto, error) {
	return g.genreRepo.GetGenres()
}

func (g *GenreServiceImpl) GetGenreByProduct(id uuid.UUID) (*models.GenreDto, error) {
	return g.genreRepo.GetGenreByProduct(id)
}

func (g *GenreServiceImpl) UpdateProductGenre(productID uuid.UUID, genreID uuid.UUID) error {
	return g.genreRepo.UpdateProductGenre(productID, genreID)
}
