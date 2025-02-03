using AuctionService.Entities;
using AuctionService.Repositories;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Auctions.Command.CancelAuction;
public record CancelAuctionCommand(
    Guid Id
) : ICommand<bool>;
public class CancelAuctionHandler
(IAuctionRepository repo, IPublishEndpoint publish)
 : ICommandHandler<CancelAuctionCommand, bool>
{
    public async Task<bool> Handle(CancelAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);

        if (auction == null || auction.Status != AuctionStatus.Live) return false;

        auction.AuctionEnd = DateTime.UtcNow;
        auction.Status = AuctionStatus.ReserveNotMet;
        auction.SoldAmount = null;
        auction.CurrentHighBid = null;

        var result = await repo.SaveChangesAsync(cancellationToken);

        if (result)
        {
            try
            {
                await publish.Publish(new AuctionCanceled { AuctionId = auction.Id });
                Console.WriteLine("Event published successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to publish event: {ex.Message}");
            }
        }
        return result;
    }
}



