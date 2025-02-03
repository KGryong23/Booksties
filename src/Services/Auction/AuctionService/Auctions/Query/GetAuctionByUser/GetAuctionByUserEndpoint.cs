using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.GetAuctionByUser;

public class GetAuctionByUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/user/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetAuctionByUserQuery(id));
            return Results.Ok(new Response<List<AuctionDto>>(201, "Get succeed", result));
        }).RequireAuthorization();
    }
}



