namespace AuctionService.DTOs;

public record CreateAuctionDto(
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string ImageUrl,
    string? Description,
    decimal ReservePrice,
    Guid SellerId,
    string Seller,
    string? SellerAddress,
    DateTime AuctionEnd
);




