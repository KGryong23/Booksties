using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.RequestHelpers;

namespace AuctionService.Repositories;

public interface IAuctionRepository
{
    void AddAuction(Auction auction);
    void RemoveAuction(Auction auction);
    Task<Auction?> GetAuctionEntityByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<Auction>> GetFinishedAuctionsAsync(CancellationToken cancellationToken);
    Task<AuctionDto?> GetAuctionByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
    Task<List<AuctionDto>> SearchAuctions(SearchParams searchParams, CancellationToken cancellationToken);
    Task<List<AuctionDto>> GetAuctionByUser(Guid id, CancellationToken cancellationToken);
    Task<List<AuctionDto>> GetWinBidByUser(Guid id, CancellationToken cancellationToken);
    Task<AuctionSummaryResultDto> AuctionSummaryResult();
    Task<List<AuctionDto>> GetAuctionPaginate(SearchParams searchParams, CancellationToken cancellationToken);
    Task<List<AuctionDto>> GetAuctionPaginateBySeller(SearchParamsBySeller searchParams, Guid SellerId, CancellationToken cancellationToken);
    Task<int> GetAuctionsCountForToday(Guid sellerId);
    Task<Auction?> GetLatestAuctionBySeller(Guid sellerId);
    Task<List<AuctionWinnerDto>> GetAuctionByWinner(SearchParamsByWinner Search, Guid WinnerId, CancellationToken cancellationToken);
    Task<List<TitleDto>> GetAllTitle(CancellationToken cancellationToken);
}