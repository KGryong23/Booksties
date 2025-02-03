namespace CommonLib.Messaging.Events;

public record BidPlaced
{
    public required Guid Id { get; set; }
    public required Guid AuctionId { get; set; }
    public required Guid BidderId { get; set; }
    public required string Bidder { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal Amount { get; set; }
    public required string Status { get; set; }
}


