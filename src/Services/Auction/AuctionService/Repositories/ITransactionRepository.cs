using AuctionService.Entities;

namespace AuctionService.Repositories;

public interface ITransactionRepository
{
    void AddTransaction(Transaction transaction);
    void RemoveTransaction(Transaction transaction);
}


