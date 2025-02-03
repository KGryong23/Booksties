namespace AuctionService.Auctions.Command.UpdateStatus;
public record UpdateStatusRequest(
    Guid Id,
    string Status
);
public class UpdateStatusEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update/status", async (UpdateStatusRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateStatusCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Update status success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Update status failed",
                    result
                ));
            }
        }).RequireAuthorization("update_auction_status");
    }
}



