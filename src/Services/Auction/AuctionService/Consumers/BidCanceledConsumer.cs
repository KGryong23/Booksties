using AuctionService.DTOs;
using AuctionService.Repositories;
using BiddingService;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Consumers;

public class BidCanceledConsumer
(IAuctionRepository repo, GrpcBid.GrpcBidClient client)
 : IConsumer<BidCanceled>
{
    public async Task Consume(ConsumeContext<BidCanceled> context)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(context.Message.AuctionId, default);
        if (auction == null) return;
        var res = await client.GetHighBidAsync(new GetHighBidRequest { Id = auction.Id.ToString() }, default);

        var highBid = res.Adapt<HighBidDto>();

        if (highBid.Status == "NoBid")
        {
            auction.CurrentHighBid = null;
        }
        auction.CurrentHighBid = highBid.Amount;
        await repo.SaveChangesAsync(default);
    }
}


