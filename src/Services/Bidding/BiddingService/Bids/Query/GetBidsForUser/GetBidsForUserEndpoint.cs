using BiddingService.DTOs;

namespace BiddingService.Bids.Query.GetBidsForUser;

public class GetBidsForUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Bid/user/{id}", async (Guid id, ISender sender) =>
       {
           var result = await sender.Send(new GetBidsForUserQuery(id));
           return Results.Ok(new Response<List<BidDto>>(
               201,
               "Get success",
               result
           ));
       });
    }
}



