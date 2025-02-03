using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.GetAllTitle;

public class GetAllTitleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/title", async (ISender sender) =>
        {
            var result = await sender.Send(new GetAllTitleQuery());
            return Results.Ok(new Response<List<TitleDto>>(201, "Get succeed", result));
        });
    }
}



