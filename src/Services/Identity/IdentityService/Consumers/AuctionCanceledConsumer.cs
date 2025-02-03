using BiddingService;
using CommonLib.Messaging.Events;
using IdentityService.Dtos;
using MassTransit;

namespace IdentityService.Consumers;

public class AuctionCanceledConsumer
(
 IWalletRepository walletRepository,
  GrpcBid.GrpcBidClient bidClient,
  ILogger<AuctionCanceledConsumer> logger
 )
 : IConsumer<AuctionCanceled>
{
    public async Task Consume(ConsumeContext<AuctionCanceled> context)
    {
        logger.LogInformation("--> Consuming Auction Canceled");

        var bids = await GetBidsForAuction(context.Message.AuctionId);

        foreach (var bid in bids)
        {
            var result = await walletRepository.RefundTransaction(
                bid.BidderId,
                bid.Amount,
                "Phiên đấu giá bị hủy, không phí"
            );
            if (result)
            {
                logger.LogInformation("--> Refund successful for BidderId: {BidderId}, Amount: {Amount}", bid.BidderId, bid.Amount);
            }
            else
            {
                logger.LogWarning("--> Refund failed for BidderId: {BidderId}, Amount: {Amount}", bid.BidderId, bid.Amount);
            }
        }
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


