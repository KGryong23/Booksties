namespace AuctionService.Auctions.Command.CancelAuction;

public class CancelAuctionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/cancel/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new CancelAuctionCommand(id));
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Cancel auction success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Cancel auction failed",
                    result
                ));
            }
        }).RequireAuthorization("cancel_auction");
    }
}



