using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionService.Entities;

[Table("items")]
public class Item
{
    public Guid Id { get; set; }
    [Column("title")]
    public required string Title { get; set; }

    [Column("author")]
    public required string Author { get; set; }

    [Column("publisher")]
    public required string Publisher { get; set; }

    [Column("year")]
    public int Year { get; set; }

    [Column("page_count")]
    public int PageCount { get; set; }

    [Column("image_url")]
    public required string ImageUrl { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    public Auction Auction { get; set; } = null!;

    [Column("auction_id")]
    public Guid AuctionId { get; set; }
}



