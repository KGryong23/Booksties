using AuctionService.Entities;
using AuctionService.Repositories;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Auctions.Command.UpdateTransactionStatus;
public record UpdateTransactionStatusCommand(
    Guid Id,
    string Status
) : ICommand<bool>;
public class UpdateTransactionStatusHandler
(IAuctionRepository repo, IPublishEndpoint publish)
 : ICommandHandler<UpdateTransactionStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateTransactionStatusCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        if (auction.Transaction.TransactionStatus != TransactionStatus.Shipped)
            return false;
        if (request.Status == "Completed")
        {
            auction.Transaction.TransactionStatus = TransactionStatus.Completed;
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
                Description = "Hoàn tiền do người mua hủy"
            });
        }
        else if (result && request.Status == "Completed")
        {
            await publish.Publish(new RefundTransaction
            {
                UserId = auction.SellerId,
                RefundAmount = auction.SoldAmount ?? 0,
                Description = "Trả tiền phiên hoàn thành"
            });
        }
        return result;
    }
}



