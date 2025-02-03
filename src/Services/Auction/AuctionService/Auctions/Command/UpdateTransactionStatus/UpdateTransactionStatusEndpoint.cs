namespace AuctionService.Auctions.Command.UpdateTransactionStatus;
public record UpdateTransactionStatusRequest(
    Guid Id,
    string Status
);
public class UpdateTransactionStatusEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update/transaction", async (UpdateTransactionStatusRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateTransactionStatusCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Update transaction success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Update transaction failed",
                    result
                ));
            }
        }).RequireAuthorization();
    }
}



