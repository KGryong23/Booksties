using AuctionService.DTOs;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.GetAuctionById;

public record GetAuctionByIdQuery(Guid Id) : IQuery<AuctionDto?>;
public class GetAuctionByIdHandler(IAuctionRepository repo)
 : IQueryHandler<GetAuctionByIdQuery, AuctionDto?>
{
    public async Task<AuctionDto?> Handle(GetAuctionByIdQuery request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionByIdAsync(request.Id, cancellationToken);
        return auction;
    }
}


