using BiddingService.Repositories;
using CommonLib.Messaging.Events;
using MassTransit;

namespace BiddingService.Bids.Command.DeleteBid;
public record DeleteBidCommand(
    Guid Id
) : ICommand<bool>;
public class DeleteBidHandler
(IBidRepository repo, IPublishEndpoint publish)
 : ICommandHandler<DeleteBidCommand, bool>
{
    public async Task<bool> Handle(DeleteBidCommand request, CancellationToken cancellationToken)
    {
        var bid = await repo.GetBidEntityByIdAsync(request.Id, cancellationToken);
        if (bid == null) return false;
        repo.RemoveBid(bid);
        await publish.Publish(new BidCanceled { AuctionId = bid.AuctionId });
        return await repo.SaveChangesAsync(cancellationToken);
    }
}



