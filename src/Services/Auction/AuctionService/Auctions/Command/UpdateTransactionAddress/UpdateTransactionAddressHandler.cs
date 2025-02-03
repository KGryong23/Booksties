using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.UpdateTransactionAddress;
public record UpdateTransactionAddressCommand(
   Guid Id,
   string Address
) : ICommand<bool>;
public class UpdateTransactionAddressHandler
(IAuctionRepository repo)
 : ICommandHandler<UpdateTransactionAddressCommand, bool>
{
    public async Task<bool> Handle(UpdateTransactionAddressCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        auction.Transaction.ShippingAddress = request.Address;
        return await repo.SaveChangesAsync(cancellationToken);
    }
}



