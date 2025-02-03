using BiddingService.DTOs;

namespace BiddingService.Bids.Query.GetLastSixMonthsSales;

public class GetLastSixMonthsSalesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Bid/six", async (ISender sender) =>
        {
            var result = await sender.Send(new GetLastSixMonthsSalesQuery(""));
            return Results.Ok(new Response<LastSixMonthsAuction>(
                201,
                "Get success",
                result
            ));
        });
    }
}



