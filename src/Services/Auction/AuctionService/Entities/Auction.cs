using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionService.Entities;

[Table("auctions")]
public class Auction
{
    public Guid Id { get; set; }

    [Column("reserve_price")]
    public decimal ReservePrice { get; set; } = 0;

    [Column("seller_id")]
    public required Guid SellerId { get; set; }

    [Column("seller")]
    public required string Seller { get; set; }

    [Column("seller_address")]
    public string? SellerAddress { get; set; }

    [Column("winner_id")]
    public Guid? WinnerId { get; set; }

    [Column("winner")]
    public string? Winner { get; set; }

    [Column("sold_amount")]
    public decimal? SoldAmount { get; set; }

    [Column("current_high_bid")]
    public decimal? CurrentHighBid { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("auction_end")]
    public DateTime AuctionEnd { get; set; }

    [Column("status")]
    public AuctionStatus Status { get; set; }

    public Item Item { get; set; } = null!;
    public Transaction Transaction { get; set; } = null!;

    public bool HasReservePrice() => ReservePrice > 0;
}



