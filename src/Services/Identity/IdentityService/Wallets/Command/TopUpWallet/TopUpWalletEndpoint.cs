namespace IdentityService.Wallets.Command.TopUpWallet;
public record TopUpWalletRequest(
    Guid UserId,
    decimal Amount
);
public class TopUpWalletEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Wallet", async (TopUpWalletRequest request, ISender sender) =>
        {
            var command = request.Adapt<TopUpWalletCommand>();
            var result = await sender.Send(command);
            return Results.Ok(new Response<bool>(
                201,
                "Top up Wallet succeed",
                result
            ));
        }).RequireAuthorization();
    }
}



