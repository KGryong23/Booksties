using AuctionService.DTOs;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.AuctionSummaryResult;
public record AuctionSummaryResultQuery(string id) : IQuery<AuctionSummaryResultDto>;
public class AuctionSummaryResultHandler
(IAuctionRepository auctionRepository)
 : IQueryHandler<AuctionSummaryResultQuery, AuctionSummaryResultDto>
{
    public async Task<AuctionSummaryResultDto> Handle(AuctionSummaryResultQuery request, CancellationToken cancellationToken)
    {
        return await auctionRepository.AuctionSummaryResult();
    }
}


