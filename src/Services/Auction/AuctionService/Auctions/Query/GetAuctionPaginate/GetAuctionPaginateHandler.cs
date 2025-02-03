using AuctionService.DTOs;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;

namespace AuctionService.Auctions.Query.GetAuctionPaginate;
public record GetAuctionPaginateQuery(
        string? SearchTerm,
        string? FilterBy,
        string? OrderBy,
        string? Seller,
        string? Winner,
        int Limit = 4,
        int Page = 1
) : IQuery<List<AuctionDto>>;
public class GetAuctionPaginateHandler
(IAuctionRepository repo)
 : IQueryHandler<GetAuctionPaginateQuery, List<AuctionDto>>
{
    public async Task<List<AuctionDto>> Handle(GetAuctionPaginateQuery request, CancellationToken cancellationToken)
    {
        var searchParams = request.Adapt<SearchParams>();
        return await repo.GetAuctionPaginate(searchParams, cancellationToken);
    }
}


