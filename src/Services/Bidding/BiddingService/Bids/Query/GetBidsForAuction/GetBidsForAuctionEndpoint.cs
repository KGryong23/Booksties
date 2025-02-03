using BiddingService.DTOs;

namespace BiddingService.Bids.Query.GetBidsForAuction;

public class GetBidsForAuctionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Bid/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetBidsForAuctionQuery(id));
            return Results.Ok(new Response<List<BidDto>>(
                201,
                "Get success",
                result
            ));
        });
    }
}



