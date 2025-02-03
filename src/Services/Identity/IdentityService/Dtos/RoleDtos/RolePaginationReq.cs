namespace IdentityService.Dtos.RoleDtos;

public record RolePaginationReq
(
    string? RoleName,
    string? Field,
    string? Order,
    int Limit = 5,
    int Page = 1
);


