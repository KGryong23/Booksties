using AuctionService.DTOs;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;

namespace AuctionService.Auctions.Query.SearchAuctions;
public record SearchAuctionsQuery(
        string? SearchTerm,
        string? FilterBy,
        string? OrderBy,
        string? Seller,
        string? Winner,
        int Limit = 4,
        int Page = 1
) : IQuery<List<AuctionDto>>;
public class SearchAuctionsHandler(IAuctionRepository repo) : IQueryHandler<SearchAuctionsQuery, List<AuctionDto>>
{
        public async Task<List<AuctionDto>> Handle(SearchAuctionsQuery request, CancellationToken cancellationToken)
        {
                var searchParams = request.Adapt<SearchParams>();
                var auctions = await repo.SearchAuctions(searchParams, cancellationToken);
                return auctions;
        }
}


