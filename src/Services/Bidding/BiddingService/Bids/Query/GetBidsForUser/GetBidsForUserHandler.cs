using BiddingService.DTOs;
using BiddingService.Repositories;

namespace BiddingService.Bids.Query.GetBidsForUser;
public record GetBidsForUserQuery(
  Guid Id
) : IQuery<List<BidDto>>;
public class GetBidsForUserHandler
(IBidRepository repo)
 : IQueryHandler<GetBidsForUserQuery, List<BidDto>>
{
    public async Task<List<BidDto>> Handle(GetBidsForUserQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetBidsForUser(request.Id, cancellationToken);
    }
}


