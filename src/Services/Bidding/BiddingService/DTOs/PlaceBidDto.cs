namespace BiddingService.DTOs;

public record PlaceBidDto
(
    Guid AuctionId,
    decimal Amount,
    string Bidder
);


