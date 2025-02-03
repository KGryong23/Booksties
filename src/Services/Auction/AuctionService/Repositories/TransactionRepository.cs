using AuctionService.Data;
using AuctionService.Entities;

namespace AuctionService.Repositories;

public class TransactionRepository(AuctionDbContext context) : ITransactionRepository
{
    public void AddTransaction(Transaction transaction)
    {
        context.Transactions.Add(transaction);
    }

    public void RemoveTransaction(Transaction transaction)
    {
        context.Transactions.Remove(transaction);
    }
}




