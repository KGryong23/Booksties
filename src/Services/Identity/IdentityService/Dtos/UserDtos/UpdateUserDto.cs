namespace IdentityService.Dtos.UserDtos
{
    public record UpdateUserDto
    (
        Guid UserId,
        string Address,
        bool IsActive,
        Guid RoleId,
        int Reputation
    );
}
