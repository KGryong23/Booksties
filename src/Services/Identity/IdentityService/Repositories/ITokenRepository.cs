namespace IdentityService.Repositories
{
    public interface ITokenRepository
    {
        Task<bool> CheckTokenByUserId(Guid userId, string token);
        Task<bool> CreateRefreshToken(Guid userId, string token);
        Task<bool> DeleteTokenByUserId(Guid userId);
    }
}

