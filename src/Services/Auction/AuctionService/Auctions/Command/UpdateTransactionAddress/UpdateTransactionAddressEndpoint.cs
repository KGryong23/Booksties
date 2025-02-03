namespace AuctionService.Auctions.Command.UpdateTransactionAddress;
public record UpdateTransactionAddressRequest(
   Guid Id,
   string Address
);
public class UpdateTransactionAddressEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update/transaction/address", async (UpdateTransactionAddressRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateTransactionAddressCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Update address success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Update address failed",
                    result
                ));
            }
        }).RequireAuthorization();
    }
}



