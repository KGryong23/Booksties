using AuctionService;
using BiddingService.DTOs;
using BiddingService.Entities;
using BiddingService.Repositories;
using CommonLib.Messaging.Events;
using IdentityService;
using MassTransit;
using Response = CommonLib.Responses.Response<BiddingService.DTOs.BidDto?>;

namespace BiddingService.Bids.Command.PlaceBid;
public record PlaceBidCommand(
   Guid AuctionId,
   Guid BidderId,
   string Bidder,
   decimal Amount
) : ICommand<Response>;
public class PlaceBidHandler(
    IBidRepository repo,
    GrpcAuction.GrpcAuctionClient client,
    GrpcWalletBalance.GrpcWalletBalanceClient grpcWallet,
    IPublishEndpoint publishEndpoint
)
 : ICommandHandler<PlaceBidCommand, Response>
{
    public async Task<CommonLib.Responses.Response<BidDto?>> Handle(PlaceBidCommand request, CancellationToken cancellationToken)
    {
        var balance = await GetBalance(request.BidderId);
        if (balance < request.Amount)
            return new Response(301, "Số dư trong ví của bạn không đủ", null);
        var auction = await GetAuction(request.AuctionId, cancellationToken);

        if (auction == null || auction.Status != "Live")
            return new Response(301, "Phiên đấu giá đã kết thúc!", null);

        if (auction.SellerId == request.BidderId)
            return new Response(301, "Chủ sản phẩm không được phép đấu giá!", null);

        var bid = request.Adapt<Bid>();
        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            return new Response(301, "Phiên đấu giá đã kết thúc", null);
        }
        else
        {
            var highBid = await repo.GetHighBid(request.AuctionId, cancellationToken);
            if (highBid != null && bid.Amount > highBid.Amount || highBid == null)
            {
                bid.Status = request.Amount > auction.ReservePrice
                 ? BidStatus.Accepted
                 : BidStatus.AcceptedBelowReserve;
            }
            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.Status = BidStatus.TooLow;
            }
        }
        repo.AddBid(bid);
        var result = await repo.SaveChangesAsync(cancellationToken);
        if (!result)
        {
            return new Response(301, "Đã có lỗi xảy ra đặt giá xin hãy thử lại", null);
        }
        await publishEndpoint.Publish(bid.Adapt<BidPlaced>());
        return new Response(201, "Đặt giá thành công!", bid.Adapt<BidDto>());
    }
    private async Task<AuctionDto?> GetAuction(Guid AuctionId, CancellationToken cancellationToken)
    {
        var auction = await client.GetAuctionAsync(
            new GetAuctionRequest { Id = AuctionId.ToString() },
            cancellationToken: cancellationToken
        );
        return auction.Adapt<AuctionDto>();
    }
    private async Task<decimal> GetBalance(Guid id)
    {
        var balance = await grpcWallet.GetWalletBalanceAsync(new GetWalletBalanceRequest { Id = id.ToString() });
        return decimal.Parse(balance.Balance);
    }
}


