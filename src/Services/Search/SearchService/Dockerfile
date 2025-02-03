FROM golang:1.23.3 AS builder

# Set Environment Variables
ENV HOME /app
ENV CGO_ENABLED 0
ENV GOOS linux

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Build app from the main.go file in cmd/api/
RUN go build -a -installsuffix cgo -o main ./cmd/api

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]



