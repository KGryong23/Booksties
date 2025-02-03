namespace IdentityService.Wallets.Command.TopUpWallet;

public record TopUpWalletCommand(
    Guid UserId,
    decimal Amount
) : ICommand<bool>;
public class TopUpWalletHandler
  (IWalletRepository walletRepository)
 : ICommandHandler<TopUpWalletCommand, bool>
{
    public async Task<bool> Handle(TopUpWalletCommand request, CancellationToken cancellationToken)
    {
        return await walletRepository.TopUpWallet(request.UserId, request.Amount);
    }
}



