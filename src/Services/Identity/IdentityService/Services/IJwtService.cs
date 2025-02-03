using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Services
{
    public interface IJwtService
    {
        string GenerateAccessToken(Guid id, string role, IEnumerable<PermissionDto> permissions);
        string GenerateRefreshToken(Guid id);
    }
}
