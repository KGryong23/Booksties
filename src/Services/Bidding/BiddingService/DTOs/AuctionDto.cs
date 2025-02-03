using System;

namespace BiddingService.DTOs;

public record AuctionDto
(
    Guid Id,
    decimal ReservePrice,
    Guid SellerId,
    decimal? CurrentHighBid,
    DateTime AuctionEnd,
    string Status
);
