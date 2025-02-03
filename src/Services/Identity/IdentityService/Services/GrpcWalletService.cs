using Grpc.Core;

namespace IdentityService.Services;

public class GrpcWalletService(IWalletRepository walletRepository) : GrpcWalletBalance.GrpcWalletBalanceBase
{
    public override async Task<GrpcWalletBalanceResponse> GetWalletBalance(GetWalletBalanceRequest request, ServerCallContext context)
    {
        var balance = await walletRepository.GetWalletBalance(Guid.Parse(request.Id))
              ?? throw new RpcException(new Status(StatusCode.NotFound, "Not Found"));
        return new GrpcWalletBalanceResponse { Balance = balance.ToString() };
    }
}


