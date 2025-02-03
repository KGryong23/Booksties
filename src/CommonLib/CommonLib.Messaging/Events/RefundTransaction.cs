namespace CommonLib.Messaging.Events;

public record RefundTransaction
{
    public Guid UserId { get; set; }
    public decimal RefundAmount { get; set; }
    public string? Description { get; set; }
}


