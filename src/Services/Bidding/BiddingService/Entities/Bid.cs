using System.ComponentModel.DataAnnotations.Schema;

namespace BiddingService.Entities;

[Table("bids")]
public class Bid
{
    public Guid Id { get; set; }
    [Column("auction_id")]
    public required Guid AuctionId { get; set; }
    [Column("bidder_id")]
    public required Guid BidderId { get; set; }
    [Column("bidder")]
    public required string Bidder { get; set; }
    [Column("amount")]
    public decimal Amount { get; set; }
    [Column("status")]
    public BidStatus Status { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


