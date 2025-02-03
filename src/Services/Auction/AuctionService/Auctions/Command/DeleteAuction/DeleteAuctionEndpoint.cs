namespace AuctionService.Auctions.Command.DeleteAuction;

public class DeleteAuctionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/delete/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new DeleteAuctionCommand(id));
            if (result)
            {
                return Results.Ok(new Response<bool>(201, "Delete auction succeed", result));
            }
            return Results.Ok(new Response<bool>(301, "Delete auction failed", result));
        }).RequireAuthorization("delete_auction");
    }
}



