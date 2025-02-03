namespace IdentityService.Dtos.WalletDtos;

public record RefundTransactionDto
(
   Guid UserId,
   decimal RefundAmount,
   string Description
);


