using BiddingService.Entities;
using Microsoft.EntityFrameworkCore;

namespace BiddingService.Data;

public class BidDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Bid> Bids { get; set; }
}

