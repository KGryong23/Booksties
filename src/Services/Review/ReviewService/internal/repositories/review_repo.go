package repositories

import (
	"ReviewService/internal/models"
	"ReviewService/internal/query"
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const dbTimeout = 3 * time.Second

type ReviewRepository interface {
	AddOrUpdateReview(review *models.AddOrUpdateReviewDto) error
	DeleteReview(review *models.DeleteReviewDto) error
	AvgRatingAndTotalReview(productID uuid.UUID) (*models.SendReviewDto, error)
	GetReviewByProdID(productID uuid.UUID) ([]models.GetReviewByProdIDDto, error)
}

type ReviewRepositoryImpl struct {
	db *sql.DB
}

func NewReviewRepository(db *sql.DB) ReviewRepository {
	return &ReviewRepositoryImpl{
		db: db,
	}
}

func (r *ReviewRepositoryImpl) AddOrUpdateReview(review *models.AddOrUpdateReviewDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(
		ctx,
		query.ADD_OR_UPDATE,
		review.ProductID,
		review.UserID,
		review.Username,
		review.Rating,
		review.Comment,
	)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *ReviewRepositoryImpl) DeleteReview(review *models.DeleteReviewDto) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(
		ctx,
		query.DELETE_REVIEW,
		review.ProductID,
		review.UserID,
	)

	if err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *ReviewRepositoryImpl) AvgRatingAndTotalReview(productID uuid.UUID) (*models.SendReviewDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var review models.SendReviewDto

	err := r.db.QueryRowContext(ctx, query.AVG_RATING_TOTAL_REVIEW, productID).Scan(
		&review.AverageRating,
		&review.QuantityEvaluate,
	)
	review.ProductID = productID
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepositoryImpl) GetReviewByProdID(productID uuid.UUID) ([]models.GetReviewByProdIDDto, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var reviews []models.GetReviewByProdIDDto
	rows, err := r.db.QueryContext(ctx, query.GET_REVIEW_BY_PROD_ID, productID)
	if err != nil {
		return reviews, err
	}
	for rows.Next() {
		var review models.GetReviewByProdIDDto
		err := rows.Scan(
			&review.ReviewID,
			&review.Username,
			&review.Rating,
			&review.Comment,
			&review.UpdatedAt,
		)
		if err != nil {
			return reviews, err
		}
		reviews = append(reviews, review)
	}
	return reviews, nil
}
