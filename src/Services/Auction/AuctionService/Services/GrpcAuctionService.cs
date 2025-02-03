using AuctionService.Repositories;
using Grpc.Core;

namespace AuctionService.Services;

public class GrpcAuctionService(IAuctionRepository repo) : GrpcAuction.GrpcAuctionBase
{
    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        var auction = await repo.GetAuctionByIdAsync(Guid.Parse(request.Id), default) ?? throw new RpcException(new Status(StatusCode.NotFound, "Not Found"));
        return auction.Adapt<GrpcAuctionResponse>();
    }
}

