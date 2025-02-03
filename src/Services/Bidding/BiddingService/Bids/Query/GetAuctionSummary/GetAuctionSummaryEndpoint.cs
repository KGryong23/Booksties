using BiddingService.Bids.Query.GetAuctionSummary;
using BiddingService.DTOs;

namespace BiddingService.Bids.Query;

public class GetAuctionSummaryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Bid/summary", async (ISender sender) =>
        {
            var result = await sender.Send(new GetAuctionSummaryQuery(""));
            return Results.Ok(new Response<AuctionSummary>(
                201,
                "Get success",
                result
            ));
        });
    }
}





