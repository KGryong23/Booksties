using AuctionService.Entities;
using AuctionService.Repositories;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Auctions.Command.UpdateStatusBySeller;
public record UpdateStatusBySellerCommand(
    Guid Id,
    string Status
) : ICommand<bool>;
public class UpdateStatusBySellerHandler
(IAuctionRepository repo, IPublishEndpoint publish)
 : ICommandHandler<UpdateStatusBySellerCommand, bool>
{
    public async Task<bool> Handle(UpdateStatusBySellerCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        if (auction.Transaction.TransactionStatus != TransactionStatus.Pending)
            return false;
        if (request.Status == "Shipped")
        {
            auction.Transaction.TransactionStatus = TransactionStatus.Shipped;
        }
        else if (request.Status == "Cancelled")
        {
            auction.Transaction.TransactionStatus = TransactionStatus.Cancelled;
        }
        var result = await repo.SaveChangesAsync(cancellationToken);
        if (result && request.Status == "Cancelled")
        {
            await publish.Publish(new RefundTransaction
            {
                UserId = auction.WinnerId ?? Guid.NewGuid(),
                RefundAmount = auction.SoldAmount ?? 0,
                Description = "Hoàn tiền do người bán hủy"
            });
        }
        return result;
    }
}


