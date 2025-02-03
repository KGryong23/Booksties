namespace IdentityService.Dtos.WalletDtos;

public record TopUpWalletDto
(
    Guid UserId,
    decimal Amount
);


