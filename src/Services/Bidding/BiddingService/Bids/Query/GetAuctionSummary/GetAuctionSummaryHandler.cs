using BiddingService.DTOs;
using BiddingService.Repositories;

namespace BiddingService.Bids.Query.GetAuctionSummary;
public record GetAuctionSummaryQuery(string id) : IQuery<AuctionSummary>;
public class GetAuctionSummaryHandler
(IBidRepository bidRepository)
 : IQueryHandler<GetAuctionSummaryQuery, AuctionSummary>
{
    public async Task<AuctionSummary> Handle(GetAuctionSummaryQuery request, CancellationToken cancellationToken)
    {
        return await bidRepository.GetAuctionSummary();
    }
}



