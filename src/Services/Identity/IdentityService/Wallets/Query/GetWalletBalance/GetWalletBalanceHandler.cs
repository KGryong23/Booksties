namespace IdentityService.Wallets.Query.GetWalletBalance;

public record GetWalletBalanceQuery(Guid Id) : IQuery<decimal?>;
public class GetWalletBalanceHandler
 (IWalletRepository walletRepository)
 : IQueryHandler<GetWalletBalanceQuery, decimal?>
{
    public async Task<decimal?> Handle(GetWalletBalanceQuery request, CancellationToken cancellationToken)
    {
        return await walletRepository.GetWalletBalance(request.Id);
    }
}




