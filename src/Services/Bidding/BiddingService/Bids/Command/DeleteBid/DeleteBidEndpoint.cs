namespace BiddingService.Bids.Command.DeleteBid;

public class DeleteBidEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Bid/delete/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new DeleteBidCommand(id));
            return Results.Ok(new Response<bool>(
                201,
                "Delete success",
                result
            ));
        });
    }
}

