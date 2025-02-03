package models

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResponseData struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type PaginateProducts struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Count int `json:"count"`
	Data  any `json:"data"`
}

func SuccessResponse(c *gin.Context, Code int, Message string, Data interface{}) {
	c.JSON(http.StatusOK, ResponseData{
		Code:    Code,
		Message: Message,
		Data:    Data,
	})
}

func ErrorResponse(c *gin.Context, Code int, Message string) {
	c.JSON(http.StatusOK, ResponseData{
		Code:    Code,
		Message: Message,
		Data:    nil,
	})
}

func PaginateResponse(
	c *gin.Context,
	Code int,
	Message string,
	Page int,
	Limit int,
	Count int,
	Data interface{},
) {
	c.JSON(http.StatusOK, ResponseData{
		Code:    Code,
		Message: Message,
		Data: PaginateProducts{
			Page:  Page,
			Limit: Limit,
			Count: Count,
			Data:  Data,
		},
	})
}

func AuthErrorResponse(c *gin.Context, Message string) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, ResponseData{
		Code:    401,
		Message: Message,
		Data:    nil,
	})
}
