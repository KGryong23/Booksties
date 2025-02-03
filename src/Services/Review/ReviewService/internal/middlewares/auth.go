package middlewares

import (
	"ReviewService/internal/models"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("56E56246-94F3-465C-B05C-59FAC72FEDB0/-/AA30BEF1-8DFA-46E7-89D5-6BE9F3EE95EC")

type customClaims struct {
	ID          string      `json:"nameid"`
	Role        string      `json:"role"`
	Permissions interface{} `json:"permissions"`
	jwt.RegisteredClaims
}

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			models.AuthErrorResponse(c, "Authorization header missing")
			return
		}
		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if tokenString == "" {
			models.AuthErrorResponse(c, "Invalid token format")
			return
		}
		claims := &customClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})
		if err != nil || !token.Valid {
			models.AuthErrorResponse(c, "Invalid token")
			return
		}
		if claims.ExpiresAt.Time.Before(time.Now()) {
			models.AuthErrorResponse(c, "Token expired")
			return
		}
		c.Set("userID", claims.ID)
		c.Set("role", claims.Role)
		c.Set("permissions", claims.Permissions)

		c.Next()
	}
}

func RequirePermission(requiredPermission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		permissions, exists := c.Get("permissions")
		if !exists {
			models.PermissonErrorResponse(c, "No permissions found")
			return
		}

		var userPermissions []string

		switch v := permissions.(type) {
		case []interface{}:
			for _, p := range v {
				if permStr, ok := p.(string); ok {
					userPermissions = append(userPermissions, permStr)
				}
			}
		case string:
			userPermissions = append(userPermissions, v)
		default:
			models.PermissonErrorResponse(c, "Invalid permissions format")
			return
		}

		for _, permission := range userPermissions {
			if permission == requiredPermission {
				c.Next()
				return
			}
		}
		models.PermissonErrorResponse(c, "Permission denied")
	}
}
