namespace IdentityService.Dtos.UserDtos
{
    public record UserPaginationReq
    (
        string? Email,
        string? AuthMethod,
        string? Field,
        string? Order,
        int Limit = 5,
        int Page = 1
    );
}
