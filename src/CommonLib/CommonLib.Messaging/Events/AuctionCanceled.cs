namespace CommonLib.Messaging.Events;

public record AuctionCanceled
{
    public Guid AuctionId { get; set; }
}


