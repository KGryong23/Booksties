using AuctionService.DTOs;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.GetAuctionByUser;
public record GetAuctionByUserQuery(
    Guid id
) : IQuery<List<AuctionDto>>;
public class GetAuctionByUser
  (IAuctionRepository repo)
 : IQueryHandler<GetAuctionByUserQuery, List<AuctionDto>>
{
    public async Task<List<AuctionDto>> Handle(GetAuctionByUserQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetAuctionByUser(request.id, cancellationToken);
    }
}


