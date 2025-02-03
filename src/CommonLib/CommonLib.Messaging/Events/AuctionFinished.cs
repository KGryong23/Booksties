namespace CommonLib.Messaging.Events;

public record AuctionFinished
{
    public Guid AuctionId { get; set; }
    public decimal? Amount { get; set; }
    public string? Status { get; set; }
}


