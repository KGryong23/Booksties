using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.AuctionSummaryResult;

public class AuctionSummaryResultEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/summary", async (ISender sender) =>
        {
            var result = await sender.Send(new AuctionSummaryResultQuery(""));
            return Results.Ok(new Response<AuctionSummaryResultDto>(201, "Get succeed", result));
        });
    }
}



