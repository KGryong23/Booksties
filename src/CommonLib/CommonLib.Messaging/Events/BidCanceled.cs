namespace CommonLib.Messaging.Events;

public record BidCanceled
{
    public Guid AuctionId { get; set; }
}

