using BiddingService.DTOs;
using BiddingService.Repositories;

namespace BiddingService.Bids.Query.GetLastSixMonthsSales;
public record GetLastSixMonthsSalesQuery(string id) : IQuery<LastSixMonthsAuction>;
public class GetLastSixMonthsSalesHandler
(IBidRepository bidRepository)
 : IQueryHandler<GetLastSixMonthsSalesQuery, LastSixMonthsAuction>
{
    public async Task<LastSixMonthsAuction> Handle(GetLastSixMonthsSalesQuery request, CancellationToken cancellationToken)
    {
        return await bidRepository.GetLastSixMonthsSales();
    }
}


