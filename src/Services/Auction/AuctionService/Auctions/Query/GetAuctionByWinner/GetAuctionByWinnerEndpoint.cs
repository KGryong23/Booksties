using AuctionService.DTOs;
using AuctionService.RequestHelpers;

namespace AuctionService.Auctions.Query.GetAuctionByWinner;

public class GetAuctionByWinnerEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/paginate/winner/{id}", async (Guid id, [AsParameters] SearchParamsByWinner search, ISender sender) =>
        {
            var result = await sender.Send(new GetAuctionByWinnerQuery(id, search));
            return Results.Ok(new Response<PaginatedResult<AuctionWinnerDto>>(
                  201,
                  "Get succeed",
                  new PaginatedResult<AuctionWinnerDto>(
                      search.Page,
                      search.Limit,
                      result.Count,
                      result
                  )
            ));
        });
    }
}



