namespace AuctionService.DTOs;

public record AuctionDto(
    Guid Id,
    decimal ReservePrice,
    Guid SellerId,
    string Seller,
    string? SellerAddress,
    Guid? WinnerId,
    string? Winner,
    decimal? SoldAmount,
    decimal? CurrentHighBid,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime AuctionEnd,
    string Status,
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string ImageUrl,
    string? Description
);

public record AuctionSummaryResultDto
{
    public List<AuctionDto> TopAuctions { get; set; } = new();
    public int TotalAuctions { get; set; }
    public int FinishedAuctions { get; set; }
    public int ReserveNotMetAuctions { get; set; }
}

public record AuctionWinnerDto(
    Guid Id,
    decimal ReservePrice,
    Guid SellerId,
    string Seller,
    string? SellerAddress,
    decimal? SoldAmount,
    DateTime AuctionEnd,
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string ImageUrl,
    string? Description,
    string TransactionStatus,
    string? ShippingAddress
);

public record TitleDto
(
    string Title
);




