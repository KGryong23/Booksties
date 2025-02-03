package unitofwork

import (
	"context"
	"database/sql"
	"log"
)

type TransactionManager struct {
	db *sql.DB
}

func NewTransactionManager(db *sql.DB) *TransactionManager {
	return &TransactionManager{
		db: db,
	}
}

func (tm *TransactionManager) ExecuteInTransaction(ctx context.Context, fn func(tx *sql.Tx) error) (err error) {
	tx, err := tm.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			if commitErr := tx.Commit(); commitErr != nil {
				log.Printf("Failed to commit transaction: %v", commitErr)
			}
		}
	}()

	err = fn(tx)
	if err != nil {
		return err
	}

	return nil
}
