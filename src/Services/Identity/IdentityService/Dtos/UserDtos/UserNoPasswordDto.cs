namespace IdentityService.Dtos.UserDtos
{
    public record UserNoPasswordDto
    (
        Guid UserId,
        string Email,
        string AuthMethod,
        bool IsActive,
        string RoleName,
        string? Address,
        int Reputation,
        Guid RoleId
    );
}
