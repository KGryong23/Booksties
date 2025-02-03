using BiddingService.Data;
using BiddingService.DTOs;
using BiddingService.Entities;
using Microsoft.EntityFrameworkCore;

namespace BiddingService.Repositories;

public class BidRepository(BidDbContext context) : IBidRepository
{
    public async Task<Bid?> GetBidEntityByIdAsync(Guid id, CancellationToken cancellationToken)
    => await context.Bids.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

    public async Task<List<BidDto>> GetBidsForAuction(Guid id, CancellationToken cancellationToken)
    => await context.Bids.Where(i => i.AuctionId == id)
                    .OrderByDescending(i => i.CreatedAt)
                    .ProjectToType<BidDto>()
                    .ToListAsync(cancellationToken);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken)
    => await context.SaveChangesAsync(cancellationToken) > 0;

    public void AddBid(Bid bid)
    {
        context.Add(bid);
    }

    public void RemoveBid(Bid bid)
    {
        context.Remove(bid);
    }

    public async Task<Bid?> GetHighBid(Guid id, CancellationToken cancellationToken)
    {
        return await context.Bids.Where(i => i.AuctionId == id)
                                 .OrderByDescending(i => i.Amount)
                                 .Take(1)
                                 .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Bid?> GetHighAcceptedBid(Guid id, CancellationToken cancellationToken)
    {
        return await context.Bids.Where(i => i.AuctionId == id && i.Status == BidStatus.Accepted)
                                .OrderByDescending(i => i.Amount)
                                .Take(1)
                                .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AuctionSummary> GetAuctionSummary()
    {

        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var endOfLastMonth = startOfMonth.AddTicks(-1);

        var todaySales = await context.Bids
            .Where(b => b.CreatedAt >= today && b.CreatedAt < today.AddDays(1))
            .SumAsync(b => b.Amount * 0.1m);

        var currentMonthSales = await context.Bids
            .Where(b => b.CreatedAt >= startOfMonth)
            .SumAsync(b => b.Amount * 0.1m);

        var lastMonthSales = await context.Bids
            .Where(b => b.CreatedAt >= startOfLastMonth && b.CreatedAt <= endOfLastMonth)
            .SumAsync(b => b.Amount * 0.1m);

        var totalSales = await context.Bids
            .SumAsync(b => b.Amount * 0.1m);

        decimal percentageChange = 0;
        if (lastMonthSales > 0)
        {
            percentageChange = (currentMonthSales - lastMonthSales) / lastMonthSales * 100;
        }

        return new AuctionSummary(todaySales, currentMonthSales, lastMonthSales, percentageChange, totalSales);
    }


    public async Task<LastSixMonthsAuction> GetLastSixMonthsSales()
    {
        var today = DateTime.UtcNow.Date;
        var startOfCurrentMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfSixMonthsAgo = startOfCurrentMonth.AddMonths(-5);

        var salesData = await context.Bids
            .Where(b => b.CreatedAt >= startOfSixMonthsAgo)
            .GroupBy(b => new { b.CreatedAt.Year, b.CreatedAt.Month })
            .Select(g => new
            {
                g.Key.Month,
                g.Key.Year,
                TotalSales = g.Sum(b => b.Amount * 0.1m)
            })
            .ToListAsync();

        var labels = new List<string>();
        var data = new List<decimal>();

        for (var i = 0; i < 6; i++)
        {
            var currentMonth = startOfSixMonthsAgo.AddMonths(i);
            var label = $"Tháng {currentMonth.Month} Năm {currentMonth.Year}";
            labels.Add(label);

            var sales = salesData
                .FirstOrDefault(x => x.Year == currentMonth.Year && x.Month == currentMonth.Month)?.TotalSales ?? 0;
            data.Add(sales);
        }

        return new LastSixMonthsAuction(labels, data);
    }

    public async Task<List<BidDto>> GetBidsForUser(Guid id, CancellationToken cancellationToken)
    => await context.Bids.Where(i => i.BidderId == id)
                    .OrderByDescending(i => i.CreatedAt)
                    .ProjectToType<BidDto>()
                    .ToListAsync(cancellationToken);
}


