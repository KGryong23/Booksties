namespace AuctionService.Entities;

public enum AuctionStatus
{
    Pending,
    Upcoming,
    Live,
    Finished,
    ReserveNotMet
}

public enum TransactionStatus
{
    Pending,
    Shipped,
    Completed,
    Cancelled
}


