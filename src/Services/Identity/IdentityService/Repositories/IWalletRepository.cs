using IdentityService.Dtos.WalletDtos;

namespace IdentityService.Repositories;

public interface IWalletRepository
{
    Task<bool> CreateWallet(Guid userId);
    Task<bool> TopUpWallet(Guid userId, decimal amount);
    Task<bool> PayOrder(Guid userId, decimal orderAmount, string description);
    Task<bool> RefundTransaction(Guid userId, decimal refundAmount, string description);
    Task<decimal?> GetWalletBalance(Guid userId);
    Task<IEnumerable<WalletTransactionsDto>> GetWalletTransactions(Guid userId);
}


