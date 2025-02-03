using AuctionService.DTOs;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;

namespace AuctionService.Auctions.Query.GetAuctionBySeller;
public record GetAuctionBySellerQuery(
    Guid Id,
    SearchParamsBySeller Search
) : IQuery<List<AuctionDto>>;
public class GetAuctionBySellerHandler
(IAuctionRepository repo)
 : IQueryHandler<GetAuctionBySellerQuery, List<AuctionDto>>
{
    public async Task<List<AuctionDto>> Handle(GetAuctionBySellerQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetAuctionPaginateBySeller(request.Search, request.Id, cancellationToken);
    }
}


