namespace AuctionService.DTOs;

public record HighBidDto
(
    Guid BidderId,
    string Bidder,
    decimal Amount,
    string Status
);


