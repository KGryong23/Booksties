using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionService.Entities;

[Table("transactions")]
public class Transaction
{
    public Guid Id { get; set; }

    [Column("transaction_status")]
    public TransactionStatus TransactionStatus { get; set; } = TransactionStatus.Pending;

    [Column("shipping_address")]
    public string? ShippingAddress { get; set; }

    [Column("auction_id")]
    public Guid AuctionId { get; set; }

    public Auction Auction { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}




