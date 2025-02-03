using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.GetWinBidByUser;

public class GetWinBidByUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/winbid/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetWinBidByUserQuery(id));
            return Results.Ok(new Response<List<AuctionDto>>(201, "Get succeed", result));
        }).RequireAuthorization();
    }
}



