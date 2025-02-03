namespace AuctionService.Auctions.Command.UpdateAuctionEnd;
public record UpdateAuctionEndRequest(
   Guid Id,
   DateTime Time
);
public class UpdateAuctionEndEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update/time", async (UpdateAuctionEndRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateAuctionEndCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Update time success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Update time failed",
                    result
                ));
            }
        }).RequireAuthorization("update_auction_end");
    }
}





