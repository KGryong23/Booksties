namespace IdentityService.Dtos.WalletDtos;

public record PayOrderDto
(
   Guid UserId,
   decimal OrderAmount,
   string Description
);


