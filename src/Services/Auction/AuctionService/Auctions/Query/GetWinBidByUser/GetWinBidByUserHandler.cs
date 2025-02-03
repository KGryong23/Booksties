using AuctionService.DTOs;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.GetWinBidByUser;
public record GetWinBidByUserQuery(
    Guid id
) : IQuery<List<AuctionDto>>;
public class GetWinBidByUserHandler
  (IAuctionRepository repo)
 : IQueryHandler<GetWinBidByUserQuery, List<AuctionDto>>
{
    public async Task<List<AuctionDto>> Handle(GetWinBidByUserQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetWinBidByUser(request.id, cancellationToken);
    }
}


