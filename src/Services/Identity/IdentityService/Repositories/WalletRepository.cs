using System.Data;
using Dapper;
using IdentityService.Data;
using IdentityService.Dtos.WalletDtos;

namespace IdentityService.Repositories;

public class WalletRepository
   (ISqlConnectionFactory connectionFactory)
   : IWalletRepository
{
    public async Task<bool> CreateWallet(Guid userId)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new { UserId = userId };
            await connection.ExecuteAsync("CreateWallet", parameters, transaction, commandType: CommandType.StoredProcedure);
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            return false;
        }
    }

    public async Task<decimal?> GetWalletBalance(Guid userId)
    {
        using var connection = connectionFactory.Create();
        var query = "SELECT balance FROM wallets WHERE user_id = @UserId";
        var parameters = new { UserId = userId };
        return await connection.QueryFirstOrDefaultAsync<decimal?>(
            query,
            parameters
        );
    }

    public async Task<IEnumerable<WalletTransactionsDto>> GetWalletTransactions(Guid userId)
    {
        using var connection = connectionFactory.Create();
        var query = @"
            SELECT wt.transaction_id as TransactionId,
                   wt.amount as Amount,
                   wt.description as Description, 
                   wt.created_at as CreatedAt
            FROM wallet_transactions wt
            JOIN wallets w ON wt.wallet_id = w.wallet_id
            WHERE w.user_id = @UserId
            ORDER BY wt.created_at DESC";
        var parameters = new { UserId = userId };
        return await connection.QueryAsync<WalletTransactionsDto>(query, parameters);
    }

    public async Task<bool> PayOrder(Guid userId, decimal orderAmount, string description)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                UserId = userId,
                OrderAmount = orderAmount,
                Description = description
            };
            await connection.ExecuteAsync("PayOrder", parameters, transaction, commandType: CommandType.StoredProcedure);
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            return false;
        }
    }

    public async Task<bool> RefundTransaction(Guid userId, decimal refundAmount, string description)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                UserId = userId,
                RefundAmount = refundAmount,
                Description = description
            };
            await connection.ExecuteAsync("RefundTransaction", parameters, transaction, commandType: CommandType.StoredProcedure);
            transaction.Commit();
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed:", ex);
            // transaction.Rollback();
            // return false;
        }
    }

    public async Task<bool> TopUpWallet(Guid userId, decimal amount)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                UserId = userId,
                Amount = amount
            };
            await connection.ExecuteAsync("TopUpWallet", parameters, transaction, commandType: CommandType.StoredProcedure);
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            return false;
        }
    }
}

