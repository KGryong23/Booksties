using BiddingService.Repositories;
using Grpc.Core;

namespace BiddingService.Services;

public class GrpcBidService(IBidRepository repo) : GrpcBid.GrpcBidBase
{
    public override async Task<GrpcHighBidResponse?> GetHighBid(GetHighBidRequest request, ServerCallContext context)
    {
        var bid = await repo.GetHighBid(Guid.Parse(request.Id), default);
        if (bid == null)
        {
            return new GrpcHighBidResponse
            {
                Bid = new GrpcHighBidModel
                {
                    Bidder = string.Empty,
                    BidderId = Guid.Empty.ToString(),
                    Amount = "0",
                    Status = "NoBid"
                }
            };

        }
        return bid.Adapt<GrpcHighBidResponse>();
    }
    public override async Task<GrpcBidsResponse> GetBids(GetBidsRequest request, ServerCallContext context)
    {
        var bids = await repo.GetBidsForAuction(Guid.Parse(request.Id), default);
        var bidsRes = new GrpcBidsResponse();
        foreach (var bid in bids)
        {
            bidsRes.Bids.Add(new GrpcBidsModel
            {
                BidderId = bid.BidderId.ToString(),
                Amount = bid.Amount.ToString(),
                Status = bid.Status.ToString(),
            });
        }
        return bidsRes;
    }
}


