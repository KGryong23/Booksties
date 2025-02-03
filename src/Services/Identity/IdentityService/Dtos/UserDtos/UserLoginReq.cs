namespace IdentityService.Dtos.UserDtos
{
    public record UserLoginReq
    (
        string Email,
        string Password
    );
}
