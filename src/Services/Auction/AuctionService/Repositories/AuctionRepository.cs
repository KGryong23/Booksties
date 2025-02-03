using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.RequestHelpers;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Repositories;

public class AuctionRepository(AuctionDbContext context) : IAuctionRepository
{
    public void AddAuction(Auction auction)
    {
        context.Add(auction);
    }

    public void RemoveAuction(Auction auction)
    {
        context.Remove(auction);
    }

    public async Task<AuctionDto?> GetAuctionByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        Auction? auction = await context.Auctions
                    .Include(i => i.Item)
                    .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        return auction != null ? auction.Adapt<AuctionDto>() : null;
    }


    public async Task<Auction?> GetAuctionEntityByIdAsync(Guid id, CancellationToken cancellationToken)
    => await context.Auctions
                    .Include(i => i.Item)
                    .Include(i => i.Transaction)
                    .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<List<AuctionDto>> SearchAuctions(SearchParams searchParams, CancellationToken cancellationToken)
    {
        var query = context.Auctions
        .Include(i => i.Item)
        .AsQueryable();

        query = query.Where(a => a.Status != AuctionStatus.Pending);

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query = query.Where(a =>
                EF.Functions.ILike(a.Item.Title, $"%{searchParams.SearchTerm}%") ||
                EF.Functions.ILike(a.Item.Author, $"%{searchParams.SearchTerm}%") ||
                EF.Functions.ILike(a.Item.Publisher, $"%{searchParams.SearchTerm}%"));
        }

        if (!string.IsNullOrEmpty(searchParams.FilterBy))
        {
            query = searchParams.FilterBy switch
            {
                "finished" => query.Where(a =>
                    a.AuctionEnd < DateTime.UtcNow &&
                    a.Status == AuctionStatus.Finished),

                "endingSoon" => query.Where(a =>
                    a.AuctionEnd < DateTime.UtcNow.AddHours(6) &&
                    a.AuctionEnd > DateTime.UtcNow &&
                    a.Status == AuctionStatus.Live),

                "live" => query.Where(a =>
                    a.AuctionEnd > DateTime.UtcNow &&
                    a.Status == AuctionStatus.Live),

                _ => query
            };
        }

        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query = query.Where(a => a.Seller == searchParams.Seller);
        }

        if (!string.IsNullOrWhiteSpace(searchParams.Winner) && searchParams.Winner != "?")
        {
            var winner = searchParams.Winner.Replace("?", "");
            query = query.Where(a => a.Winner == winner);
        }

        query = searchParams.OrderBy switch
        {
            "new" => query.OrderByDescending(a => a.CreatedAt),
            "endingSoon" => query.OrderBy(a => a.AuctionEnd),
            "highBid" => query.OrderByDescending(a => a.CurrentHighBid ?? decimal.MinValue),
            _ => query.OrderBy(a => a.Id)
        };

        var skip = (searchParams.Page - 1) * searchParams.Limit;
        query = query.Skip(skip).Take(searchParams.Limit);

        var auctions = await query.ProjectToType<AuctionDto>().ToListAsync(cancellationToken);

        return auctions;
    }

    public async Task<List<Auction>> GetFinishedAuctionsAsync(CancellationToken cancellationToken)
    {
        return await context.Auctions
                            .Where(a => a.AuctionEnd <= DateTime.UtcNow && a.Status == AuctionStatus.Live)
                            .ToListAsync(cancellationToken);
    }

    public async Task<List<AuctionDto>> GetAuctionByUser(Guid id, CancellationToken cancellationToken)
    {
        return await context.Auctions
                            .Where(i => i.SellerId == id)
                            .ProjectToType<AuctionDto>()
                            .ToListAsync(cancellationToken);
    }

    public async Task<List<AuctionDto>> GetWinBidByUser(Guid id, CancellationToken cancellationToken)
    {
        return await context.Auctions
                            .Where(i => i.WinnerId == id)
                            .ProjectToType<AuctionDto>()
                            .ToListAsync(cancellationToken);
    }

    public async Task<AuctionSummaryResultDto> AuctionSummaryResult()
    {
        var auctionsWithBids = await context.Auctions
        .Where(a => a.CurrentHighBid != null)
        .OrderByDescending(a => a.CurrentHighBid)
        .Take(5)
        .ProjectToType<AuctionDto>()
        .ToListAsync();

        if (auctionsWithBids.Count < 5)
        {
            var additionalAuctions = await context.Auctions
                .Where(a => a.CurrentHighBid == null && !auctionsWithBids.Select(x => x.Id).Contains(a.Id))
                .OrderBy(x => Guid.NewGuid())
                .Take(5 - auctionsWithBids.Count)
                .ProjectToType<AuctionDto>()
                .ToListAsync();

            auctionsWithBids.AddRange(additionalAuctions);
        }

        var totalAuctions = await context.Auctions.CountAsync();
        var finishedAuctions = await context.Auctions.CountAsync(a => a.Status == AuctionStatus.Finished);
        var reserveNotMetAuctions = await context.Auctions.CountAsync(a => a.Status == AuctionStatus.ReserveNotMet);

        return new AuctionSummaryResultDto
        {
            TopAuctions = auctionsWithBids,
            TotalAuctions = totalAuctions,
            FinishedAuctions = finishedAuctions,
            ReserveNotMetAuctions = reserveNotMetAuctions
        };
    }

    public async Task<List<AuctionDto>> GetAuctionPaginate(SearchParams searchParams, CancellationToken cancellationToken)
    {
        var query = context.Auctions
        .Include(i => i.Item)
        .AsQueryable();

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query = query.Where(a =>
                EF.Functions.ILike(a.Item.Title, $"%{searchParams.SearchTerm}%") ||
                EF.Functions.ILike(a.Item.Author, $"%{searchParams.SearchTerm}%") ||
                EF.Functions.ILike(a.Item.Publisher, $"%{searchParams.SearchTerm}%"));
        }

        if (!string.IsNullOrEmpty(searchParams.FilterBy))
        {
            query = searchParams.FilterBy switch
            {
                "finished" => query.Where(a =>
                    a.Status == AuctionStatus.Finished
                ),

                "pending" => query.Where(a =>
                    a.Status == AuctionStatus.Pending
                ),

                "upcoming" => query.Where(a =>
                    a.Status == AuctionStatus.Upcoming
                ),

                "reserveNotMet" => query.Where(a =>
                    a.Status == AuctionStatus.ReserveNotMet
                ),

                "live" => query.Where(a =>
                    a.Status == AuctionStatus.Live
                ),

                _ => query
            };
        }

        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query = query.Where(a => a.Seller == searchParams.Seller);
        }

        if (!string.IsNullOrWhiteSpace(searchParams.Winner) && searchParams.Winner != "?")
        {
            var winner = searchParams.Winner.Replace("?", "");
            query = query.Where(a => a.Winner == winner);
        }

        query = searchParams.OrderBy switch
        {
            "new" => query.OrderByDescending(a => a.CreatedAt),
            "endingSoon" => query.OrderBy(a => a.AuctionEnd),
            "highBid" => query.OrderByDescending(a => a.CurrentHighBid ?? decimal.MinValue),
            _ => query.OrderBy(a => a.Id)
        };

        var skip = (searchParams.Page - 1) * searchParams.Limit;
        query = query.Skip(skip).Take(searchParams.Limit);

        var auctions = await query.ProjectToType<AuctionDto>().ToListAsync(cancellationToken);

        return auctions;
    }

    public async Task<List<AuctionDto>> GetAuctionPaginateBySeller(SearchParamsBySeller searchParams, Guid SellerId, CancellationToken cancellationToken)
    {
        var query = context.Auctions
       .Include(i => i.Item)
       .AsQueryable();

        query = query.Where(a => a.SellerId == SellerId);
        var filterBy = searchParams.FilterBy?.Replace("?", "");
        if (!string.IsNullOrEmpty(filterBy))
        {
            query = filterBy switch
            {
                "finished" => query.Where(a =>
                    a.Status == AuctionStatus.Finished
                ),

                "pending" => query.Where(a =>
                    a.Status == AuctionStatus.Pending
                ),

                "upcoming" => query.Where(a =>
                    a.Status == AuctionStatus.Upcoming
                ),

                "reserveNotMet" => query.Where(a =>
                    a.Status == AuctionStatus.ReserveNotMet
                ),

                "live" => query.Where(a =>
                    a.Status == AuctionStatus.Live
                ),

                _ => query
            };
        }


        var skip = (searchParams.Page - 1) * searchParams.Limit;
        query = query.Skip(skip).Take(searchParams.Limit);

        var auctions = await query.ProjectToType<AuctionDto>().ToListAsync(cancellationToken);

        return auctions;
    }

    public async Task<int> GetAuctionsCountForToday(Guid sellerId)
    {
        var today = DateTime.UtcNow.Date;
        return await context.Auctions
                    .Where(a => a.SellerId == sellerId && a.CreatedAt.Date == today)
                    .CountAsync();
    }

    public async Task<Auction?> GetLatestAuctionBySeller(Guid sellerId)
    {
        return await context.Auctions
            .Where(a => a.SellerId == sellerId)
            .OrderByDescending(a => a.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AuctionWinnerDto>> GetAuctionByWinner(SearchParamsByWinner Search, Guid WinnerId, CancellationToken cancellationToken)
    {
        var query = context.Auctions
       .Include(i => i.Item)
       .Include(i => i.Transaction)
       .AsQueryable();

        query = query.Where(a => a.WinnerId == WinnerId)
                     .OrderByDescending(a => a.AuctionEnd);

        var skip = (Search.Page - 1) * Search.Limit;
        query = query.Skip(skip).Take(Search.Limit);

        var auctions = await query.ProjectToType<AuctionWinnerDto>().ToListAsync(cancellationToken);

        return auctions;
    }

    public async Task<List<TitleDto>> GetAllTitle(CancellationToken cancellationToken)
    => await context.Auctions
                    .Include(i => i.Item)
                    .Select(i => new TitleDto(i.Item.Title))
                    .ToListAsync(cancellationToken);
}


