namespace IdentityService.Wallets.Query.GetWalletBalance;

public class GetWalletBalanceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Wallet/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetWalletBalanceQuery(id));
            return Results.Ok(new Response<decimal?>(
                201,
                "Get balance succeed",
                result
            ));
        });
    }
}



