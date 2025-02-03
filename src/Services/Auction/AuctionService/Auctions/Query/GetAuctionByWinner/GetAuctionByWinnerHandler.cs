using AuctionService.DTOs;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;

namespace AuctionService.Auctions.Query.GetAuctionByWinner;
public record GetAuctionByWinnerQuery(
    Guid WinnerId,
    SearchParamsByWinner Search
) : IQuery<List<AuctionWinnerDto>>;
public class GetAuctionByWinnerHandler
(IAuctionRepository repo)
 : IQueryHandler<GetAuctionByWinnerQuery, List<AuctionWinnerDto>>
{
    public async Task<List<AuctionWinnerDto>> Handle(GetAuctionByWinnerQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetAuctionByWinner(request.Search, request.WinnerId, cancellationToken);
    }
}


