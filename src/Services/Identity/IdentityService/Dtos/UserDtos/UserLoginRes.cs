namespace IdentityService.Dtos.UserDtos
{
    public record UserLoginRes
    (
        string Access_token,
        string Refresh_token,
        int Expires_in,
        UserNoPasswordDto? User
    );
}
