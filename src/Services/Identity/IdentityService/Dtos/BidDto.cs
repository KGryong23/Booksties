namespace IdentityService.Dtos;

public record BidDto
(
    Guid BidderId,
    decimal Amount,
    string Status
);


