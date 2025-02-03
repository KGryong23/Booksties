using BiddingService;
using CommonLib.Messaging.Events;
using IdentityService.Dtos;
using MassTransit;

namespace IdentityService.Consumers;

public class AuctionFinishedConsumer
  (IWalletRepository walletRepository, GrpcBid.GrpcBidClient bidClient, ILogger<AuctionFinishedConsumer> logger)
 : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        logger.LogInformation("--> Consuming Auction Finished");

        var bids = await GetBidsForAuction(context.Message.AuctionId);

        var highestBid = bids.Where(bid => bid.Status.Contains("Accepted"))
                             .OrderByDescending(bid => bid.Amount)
                             .FirstOrDefault();

        if (context.Message.Status!.Contains("Finished") && highestBid != null)
        {
            var nonWinningBids = bids
                .Where(bid => bid.Amount < highestBid.Amount);

            foreach (var bid in nonWinningBids)
            {
                await RefundBid(bid);
            }
        }
        else
        {
            foreach (var bid in bids)
            {
                await RefundBid(bid);
            }
        }
    }

    private async Task RefundBid(BidDto bid)
    {
        decimal refundAmount = bid.Amount - 5000;
        await walletRepository.RefundTransaction(bid.BidderId, refundAmount, "Hoàn tiền đấu giá, phí 5000 vnđ");
    }

    private async Task<List<BidDto>> GetBidsForAuction(Guid id)
    {
        var res = await bidClient.GetBidsAsync(new GetBidsRequest { Id = id.ToString() });
        var bids = new List<BidDto>();
        foreach (var item in res.Bids)
        {
            bids.Add(new BidDto
            (
                Guid.Parse(item.BidderId),
                decimal.Parse(item.Amount),
                item.Status
            ));
        }
        return bids;
    }
}


