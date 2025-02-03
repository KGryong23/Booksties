namespace AuctionService.RequestHelpers;

public record SearchParams
(
        string? SearchTerm,
        string? FilterBy,
        string? OrderBy,
        string? Seller,
        string? Winner,
        int Limit = 4,
        int Page = 1
);

public record SearchParamsBySeller
(
        string? FilterBy,
        int Limit = 4,
        int Page = 1
);

public record SearchParamsByWinner
(
        int Limit = 4,
        int Page = 1
);


