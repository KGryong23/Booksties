using BiddingService.DTOs;
using BiddingService.Repositories;

namespace BiddingService.Bids.Query.GetBidsForAuction;
public record GetBidsForAuctionQuery(Guid AuctionId) : IQuery<List<BidDto>>;
public class GetBidsForAuctionHandler(IBidRepository repo) : IQueryHandler<GetBidsForAuctionQuery, List<BidDto>>
{
    public async Task<List<BidDto>> Handle(GetBidsForAuctionQuery request, CancellationToken cancellationToken)
    => await repo.GetBidsForAuction(request.AuctionId, cancellationToken);
}


