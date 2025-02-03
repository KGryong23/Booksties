package repositories

import (
	"SearchService/internal/models"
	"context"
	"encoding/json"
	"fmt"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/get"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/index"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/update"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/sortorder"
)

type ProductRepository interface {
	CreateProduct(product models.CreateProductDTO) (*index.Response, error)
	DeleteProduct(id string) error
	GetProductById(id string) *get.Response
	UpdateProduct(product models.UpdateProductDTO) error
	SearchProducts(query string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error)
	GetProducts(genre string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error)
	UpdateSoldAndRating(product models.ReceiveUpdateSoldAndAvgRatingDTO) error
	UpdateProductGenre(genre models.UpdateProductGenreDTO) error
}

type ProductRepositoryImpl struct {
	esClient *elasticsearch.TypedClient
}

func NewProductRepository(esClient *elasticsearch.TypedClient) ProductRepository {
	return &ProductRepositoryImpl{
		esClient: esClient,
	}
}

func (p *ProductRepositoryImpl) CreateProduct(product models.CreateProductDTO) (*index.Response, error) {

	res, err := p.esClient.
		Index("products").
		Id(product.ID.String()).
		Request(product).
		Do(context.TODO())

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (p *ProductRepositoryImpl) DeleteProduct(id string) error {
	_, err := p.esClient.
		Delete("products", id).
		Do(context.TODO())
	if err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) GetProductById(id string) *get.Response {
	res, err := p.esClient.
		Get("products", id).Do(context.TODO())
	if err != nil {
		return nil
	}
	return res
}

func (p *ProductRepositoryImpl) UpdateProduct(product models.UpdateProductDTO) error {
	data, err := json.Marshal(product)
	if err != nil {
		return nil
	}

	_, err = p.esClient.Update("products", product.ID.String()).
		Request(&update.Request{
			Doc: json.RawMessage(data),
		}).Do(context.TODO())

	if err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) UpdateProductGenre(genre models.UpdateProductGenreDTO) error {
	data, err := json.Marshal(genre)
	if err != nil {
		return nil
	}

	_, err = p.esClient.Update("products", genre.ID.String()).
		Request(&update.Request{
			Doc: json.RawMessage(data),
		}).Do(context.TODO())

	if err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) UpdateSoldAndRating(product models.ReceiveUpdateSoldAndAvgRatingDTO) error {
	data, err := json.Marshal(product)
	if err != nil {
		return nil
	}

	_, err = p.esClient.Update("products", product.ID.String()).
		Request(&update.Request{
			Doc: json.RawMessage(data),
		}).Do(context.TODO())

	if err != nil {
		return err
	}
	return nil
}

func (p *ProductRepositoryImpl) SearchProducts(query string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error) {
	var products []models.SearchProductDTO

	offset := (page - 1) * limit

	boolQuery := buildSearchQuery(query, minRating, minPrice, maxPrice)
	sortFields := buildSortFields(sortBy)
	searchRes, err := p.esClient.Search().
		Index("products").
		Request(
			&search.Request{
				Query: boolQuery,
				From:  &offset,
				Size:  &limit,
				Sort:  sortFields,
			}).
		Do(context.Background())
	if err != nil {
		return nil, 0, fmt.Errorf("search failed: %v", err)
	}

	products, err = processSearchResults(searchRes)
	if err != nil {
		return nil, 0, err
	}

	totalHits := searchRes.Hits.Total.Value

	return &products, totalHits, nil
}

func (p *ProductRepositoryImpl) GetProducts(genre string, minRating float64, minPrice, maxPrice float64, sortBy string, limit, page int) (*[]models.SearchProductDTO, int64, error) {
	var products []models.SearchProductDTO

	offset := (page - 1) * limit

	boolQuery := buildGenreQuery(genre, minRating, minPrice, maxPrice)
	sortFields := buildSortFields(sortBy)
	getRes, err := p.esClient.Search().
		Index("products").
		Request(
			&search.Request{
				Query: boolQuery,
				From:  &offset,
				Size:  &limit,
				Sort:  sortFields,
			}).
		Do(context.Background())
	if err != nil {
		return nil, 0, fmt.Errorf("get failed: %v", err)
	}

	products, err = processSearchResults(getRes)
	if err != nil {
		return nil, 0, err
	}

	totalHits := getRes.Hits.Total.Value

	return &products, totalHits, nil
}

func buildSearchQuery(query string, minRating float64, minPrice, maxPrice float64) *types.Query {
	boolQuery := types.BoolQuery{
		Must: []types.Query{
			{
				MultiMatch: &types.MultiMatchQuery{
					Query: query,
					Fields: []string{
						"title^3",
						"author",
						"publisher",
						"description",
					},
				},
			},
		},
		Filter: []types.Query{},
	}

	if minRating > 0 {
		boolQuery.Filter = append(boolQuery.Filter, types.Query{
			Range: map[string]types.RangeQuery{
				"average_rating": types.NumberRangeQuery{
					Gte: (*types.Float64)(&minRating),
				},
			},
		})
	}

	if minPrice > 0 || maxPrice > 0 {
		boolQuery.Filter = append(boolQuery.Filter, types.Query{
			Range: map[string]types.RangeQuery{
				"price": types.NumberRangeQuery{
					Gte: (*types.Float64)(&minPrice),
					Lte: (*types.Float64)(&maxPrice),
				},
			},
		})
	}

	boolQuery.Filter = append(boolQuery.Filter, types.Query{
		Term: map[string]types.TermQuery{
			"is_active": {
				Value: true,
			},
		},
	})

	return &types.Query{
		Bool: &boolQuery,
	}
}

func buildGenreQuery(genre string, minRating float64, minPrice, maxPrice float64) *types.Query {
	boolQuery := types.BoolQuery{
		Filter: []types.Query{},
	}

	if minRating > 0 {
		boolQuery.Filter = append(boolQuery.Filter, types.Query{
			Range: map[string]types.RangeQuery{
				"average_rating": types.NumberRangeQuery{
					Gte: (*types.Float64)(&minRating),
				},
			},
		})
	}

	if minPrice > 0 || maxPrice > 0 {
		boolQuery.Filter = append(boolQuery.Filter, types.Query{
			Range: map[string]types.RangeQuery{
				"price": types.NumberRangeQuery{
					Gte: (*types.Float64)(&minPrice),
					Lte: (*types.Float64)(&maxPrice),
				},
			},
		})
	}
	if genre != "" && genre != "empty" {
		boolQuery.Filter = append(boolQuery.Filter, types.Query{
			Term: map[string]types.TermQuery{
				"genre_ids.keyword": {
					Value: genre,
				},
			},
		})
	}

	boolQuery.Filter = append(boolQuery.Filter, types.Query{
		Term: map[string]types.TermQuery{
			"is_active": {
				Value: true,
			},
		},
	})

	boolQuery.Filter = append(boolQuery.Filter, types.Query{
		Term: map[string]types.TermQuery{
			"product_type": {
				Value: 1,
			},
		},
	})

	return &types.Query{
		Bool: &boolQuery,
	}
}

func buildSortFields(sortBy string) []types.SortCombinations {
	var sortFields []types.SortCombinations
	switch sortBy {
	case "price_desc":
		sortFields = append(sortFields, types.SortOptions{
			SortOptions: map[string]types.FieldSort{
				"price": {
					Order: &sortorder.Desc,
				},
			},
		})
	case "price_asc":
		sortFields = append(sortFields, types.SortOptions{
			SortOptions: map[string]types.FieldSort{
				"price": {
					Order: &sortorder.Asc,
				},
			},
		})
	case "best_selling":
		sortFields = append(sortFields, types.SortOptions{
			SortOptions: map[string]types.FieldSort{
				"sold_quantity": {
					Order: &sortorder.Desc,
				},
			},
		})
	case "high_rating":
		sortFields = append(sortFields, types.SortOptions{
			SortOptions: map[string]types.FieldSort{
				"average_rating": {
					Order: &sortorder.Desc,
				},
			},
		})
	default:
		sortFields = append(sortFields, types.SortOptions{
			SortOptions: map[string]types.FieldSort{
				"created_at": {
					Order: &sortorder.Desc,
				},
			},
		})
	}
	return sortFields
}

func processSearchResults(searchRes *search.Response) ([]models.SearchProductDTO, error) {
	var products []models.SearchProductDTO

	for _, hit := range searchRes.Hits.Hits {
		var product models.SearchProductDTO
		if err := json.Unmarshal(hit.Source_, &product); err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	return products, nil
}
