using AuctionService.DTOs;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.GetAllTitle;
public record GetAllTitleQuery() : IQuery<List<TitleDto>>;
public class GetAllTitleHandler
(IAuctionRepository repo)
 : IQueryHandler<GetAllTitleQuery, List<TitleDto>>
{
    public async Task<List<TitleDto>> Handle(GetAllTitleQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetAllTitle(cancellationToken);
    }
}


