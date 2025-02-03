namespace AuctionService.Auctions.Command.EndAuction;

public class EndAuctionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/end/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new EndAuctionCommand(id));
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "End success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "End failed",
                    result
                ));
            }
        }).RequireAuthorization("end_auction");
    }
}



