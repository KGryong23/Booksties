namespace CommonLib.Messaging.Events;

public record PayOrder
{
    public Guid UserId { get; set; }
    public decimal OrderAmount { get; set; }
    public string? Description { get; set; }
}


