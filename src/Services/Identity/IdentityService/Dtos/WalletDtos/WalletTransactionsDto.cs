namespace IdentityService.Dtos.WalletDtos;

public record WalletTransactionsDto
{
      public Guid TransactionId { get; set; }
      public decimal Amount { get; set; }
      public string? Description { get; set; }
      public DateTime CreatedAt { get; set; }

}


