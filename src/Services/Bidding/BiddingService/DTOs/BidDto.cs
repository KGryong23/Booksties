namespace BiddingService.DTOs;

public record BidDto
(
    Guid Id,
    Guid AuctionId,
    Guid BidderId,
    string Bidder,
    decimal Amount,
    string Status,
    DateTime CreatedAt
);

public record AuctionSummary
(
    decimal TodaySales,
    decimal CurrentMonthSales,
    decimal LastMonthSales,
    decimal PercentageChange,
    decimal TotalSales
);

public record LastSixMonthsAuction
(
   List<string> Labels,
   List<decimal> Data
);

