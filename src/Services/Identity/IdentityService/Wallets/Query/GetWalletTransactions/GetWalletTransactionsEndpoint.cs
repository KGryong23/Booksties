using IdentityService.Dtos.WalletDtos;

namespace IdentityService.Wallets.Query.GetWalletTransactions;

public class GetWalletTransactionsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Wallet/transaction/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetWalletTransactionsQuery(id));
            return Results.Ok(new Response<IEnumerable<WalletTransactionsDto>>(
                201,
                "Get wallet transactions succeed",
                result
            ));
        });
    }
}



