using BiddingService.DTOs;
using BiddingService.Entities;

namespace BiddingService.Repositories;

public interface IBidRepository
{
    void RemoveBid(Bid bid);
    void AddBid(Bid bid);
    Task<Bid?> GetBidEntityByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<BidDto>> GetBidsForAuction(Guid id, CancellationToken cancellationToken);
    Task<Bid?> GetHighBid(Guid id, CancellationToken cancellationToken);
    Task<Bid?> GetHighAcceptedBid(Guid id, CancellationToken cancellationToken);
    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
    Task<AuctionSummary> GetAuctionSummary();
    Task<LastSixMonthsAuction> GetLastSixMonthsSales();
    Task<List<BidDto>> GetBidsForUser(Guid id, CancellationToken cancellationToken);
}


