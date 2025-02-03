using AuctionService.Repositories;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Consumers;

public class BidPlacedConsumer(IAuctionRepository repo, ILogger<BidPlacedConsumer> logger) : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        logger.LogInformation("--> Consuming bid placed");
        var auction = await repo.GetAuctionEntityByIdAsync(context.Message.AuctionId, default)
                    ?? throw new MessageException(typeof(BidPlaced), "Cannot retrieve this auction");
        if (auction.CurrentHighBid == null
            || context.Message.Status.Contains("Accepted")
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
        }

        await repo.SaveChangesAsync(default);
    }
}


