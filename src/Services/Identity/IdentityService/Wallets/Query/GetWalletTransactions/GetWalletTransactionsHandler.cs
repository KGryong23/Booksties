using IdentityService.Dtos.WalletDtos;

namespace IdentityService.Wallets.Query.GetWalletTransactions;

public record GetWalletTransactionsQuery(
    Guid UserId
) : IQuery<IEnumerable<WalletTransactionsDto>>;
public class GetWalletTransactionsHandler
  (IWalletRepository walletRepository)
 : IQueryHandler<GetWalletTransactionsQuery, IEnumerable<WalletTransactionsDto>>
{
    public async Task<IEnumerable<WalletTransactionsDto>> Handle(GetWalletTransactionsQuery request, CancellationToken cancellationToken)
    {
        return await walletRepository.GetWalletTransactions(request.UserId);
    }
}


