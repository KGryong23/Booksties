using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.Repositories;
using BiddingService;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Auctions.Command.EndAuction;
public record EndAuctionCommand(
    Guid Id
) : ICommand<bool>;
public class EndAuctionHandler
(IAuctionRepository repo, GrpcBid.GrpcBidClient client, IPublishEndpoint publish, ILogger<EndAuctionHandler> logger)
 : ICommandHandler<EndAuctionCommand, bool>
{
    public async Task<bool> Handle(EndAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        var res = await client.GetHighBidAsync(new GetHighBidRequest { Id = auction.Id.ToString() }, default);
        var winningBid = res.Adapt<HighBidDto>();

        if (winningBid.Status != "NoBid")
        {
            auction.Winner = winningBid.Bidder;
            auction.WinnerId = winningBid.BidderId;
            auction.SoldAmount = winningBid.Amount;
        }

        auction.Status = auction.SoldAmount > auction.ReservePrice
            ? AuctionStatus.Finished : AuctionStatus.ReserveNotMet;

        auction.AuctionEnd = DateTime.UtcNow;
        var result = await repo.SaveChangesAsync(cancellationToken);
        if (result)
        {
            logger.LogInformation("--> Send Auction Finished");
            await publish.Publish(new AuctionFinished
            {
                AuctionId = auction.Id,
                Status = auction.Status.ToString(),
                Amount = auction.SoldAmount,
            });
        }
        return result;
    }
}



