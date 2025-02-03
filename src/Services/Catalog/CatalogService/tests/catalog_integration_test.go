package tests

import (
	"CatalogService/internal/models"
	"CatalogService/internal/query"
	"CatalogService/internal/repositories"
	"CatalogService/internal/unitofwork"
	"database/sql"
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/ory/dockertest/v3"
	"github.com/ory/dockertest/v3/docker"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var (
	host     = "localhost"
	user     = "postgres"
	password = "postgres"
	dbName   = "catalog_test"
	port     = "5439"
	dsn      = "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable timezone=UTC connect_timeout=5"
)

var resource *dockertest.Resource
var pool *dockertest.Pool
var testDB *sql.DB
var testRepo repositories.ProductRepository

func TestMain(m *testing.M) {
	p, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("could not connect to docker; is it running? %s", err)
	}

	pool = p

	opts := dockertest.RunOptions{
		Repository: "postgres",
		Tag:        "latest",
		Env: []string{
			"POSTGRES_USER=" + user,
			"POSTGRES_PASSWORD=" + password,
			"POSTGRES_DB=" + dbName,
		},
		ExposedPorts: []string{"5432"},
		PortBindings: map[docker.Port][]docker.PortBinding{
			"5432": {
				{HostIP: "0.0.0.0", HostPort: port},
			},
		},
	}

	resource, err = pool.RunWithOptions(&opts)
	if err != nil {
		if resource != nil {
			_ = pool.Purge(resource)
		}
		log.Fatalf("could not start resource: %s", err)
	}

	if err := pool.Retry(func() error {
		var err error
		testDB, err = sql.Open("pgx", fmt.Sprintf(dsn, host, port, user, password, dbName))
		if err != nil {
			log.Println("Error:", err)
			return err
		}
		return testDB.Ping()
	}); err != nil {
		_ = pool.Purge(resource)
		log.Fatalf("could not connect to database: %s", err)
	}

	err = createTables()
	if err != nil {
		log.Fatalf("error creating tables: %s", err)
	}

	err = createProcedures()
	if err != nil {
		log.Fatalf("error creating procedures: %s", err)
	}

	testRepo = repositories.NewProductRepository(testDB)

	code := m.Run()

	if err := pool.Purge(resource); err != nil {
		log.Fatalf("could not purge resource: %s", err)
	}

	os.Exit(code)
}

func createTables() error {
	_, err := testDB.Exec(query.CREATE_TABLES)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

func createProcedures() error {
	_, err := testDB.Exec(query.CREATE_PROCEDURES)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

func Test_pingDB(t *testing.T) {
	err := testDB.Ping()
	if err != nil {
		t.Error("can't ping database")
	}
}

func TestInsertProduct(t *testing.T) {
	image := "test.png"
	id := uuid.New()
	product := &models.CreateProductDTO{
		Title:           "test",
		Author:          "trungkhlu",
		Publisher:       "trungkhlu",
		PublicationYear: 2020,
		PageCount:       220,
		Dimensions:      "bbb",
		CoverType:       "aaa",
		Price:           100000,
		Description:     "test thoi ma",
		ImageURL:        &image,
		ProductType:     1,
		IsActive:        true,
		OriginalOwnerID: &id,
	}
	tx, _ := testDB.Begin()
	_, err := testRepo.CreateProduct(tx, product)
	if err != nil {
		t.Errorf(err.Error())
	}
}

func TestGetProductByID(t *testing.T) {
	id, _ := uuid.Parse("5A2B157F-7E72-424C-948A-35DEBEF0473D")
	_, err := testRepo.GetProductById(id)
	if err != nil {
		t.Error(err.Error())
	}
}

func TestUpdateProduct(t *testing.T) {
	id, _ := uuid.Parse("5A2B157F-7E72-424C-948A-35DEBEF0473D")
	product := &models.UpdateProductDTO{
		ID:                 id,
		Title:              "test",
		Author:             "trungkhlu",
		Publisher:          "trungkhlu",
		PublicationYear:    2020,
		PageCount:          220,
		Dimensions:         "bbb",
		CoverType:          "aaa",
		Price:              100000,
		Description:        "test thoi ma",
		DiscountPercentage: 15,
		ProductType:        1,
		IsActive:           true,
	}
	err := testRepo.UpdateProduct(product)
	if err != nil {
		t.Error(err.Error())
	}
}

func TestDeleteProduct(t *testing.T) {
	id, _ := uuid.Parse("5A2B157F-7E72-424C-948A-35DEBEF0473D")
	err := testRepo.DeleteProduct(id)
	if err != nil {
		t.Error(err.Error())
	}
}

func TestCreateProductAndProductGenres(t *testing.T) {
	image := "test.png"
	id := uuid.New()
	id_genres_1, _ := uuid.Parse("8b36af78-8953-4ee5-baa9-b9f172439c37")
	id_genres_2, _ := uuid.Parse("af42161b-fc4f-43e5-8a0d-e9eb734246ab")
	product := &models.CreateProductDTO{
		Title:           "test",
		Author:          "trungkhlu",
		Publisher:       "trungkhlu",
		PublicationYear: 2020,
		PageCount:       220,
		Dimensions:      "bbb",
		CoverType:       "aaa",
		Price:           100000,
		Description:     "test thoi ma",
		ImageURL:        &image,
		ProductType:     1,
		IsActive:        true,
		OriginalOwnerID: &id,
		GenreIDs:        []uuid.UUID{id_genres_1, id_genres_2},
	}
	testTxManager := unitofwork.NewTransactionManager(testDB)
	testGenreRepo := repositories.NewGenreRepository(testDB)
	testUnitOfWork := unitofwork.NewUnitOfWork(testRepo, testGenreRepo, testTxManager)
	_, err := testUnitOfWork.CreateProductAndProductGenres(product)
	if err != nil {
		t.Error(err.Error())
	}
}
