using IdentityService.Dtos.PermissionDtos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Services
{
    public class JwtService(IConfiguration configuration) : IJwtService
    {
        public string GenerateAccessToken(Guid id, string role, IEnumerable<PermissionDto> permissions)
        {
            var claims = new List<Claim>
            {
              new Claim(ClaimTypes.NameIdentifier,id.ToString()),
              new Claim(ClaimTypes.Role,role),
            };
            if (permissions != null)
            {
                foreach (var permission in permissions)
                {
                    claims.Add(new Claim("permissions", permission.PermissionName ?? ""));
                }
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? ""));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jwt_Token = new JwtSecurityToken(
                 configuration["Jwt:Issuer"],
                 configuration["Jwt:Audience"],
                 claims,
                 expires: DateTime.Now.AddDays(1),
                 signingCredentials: credentials);
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(jwt_Token);
            return jwtToken;
        }
        public string GenerateRefreshToken(Guid id)
        {
            var claims = new List<Claim>
            {
              new Claim(ClaimTypes.NameIdentifier,id.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? ""));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jwt_Token = new JwtSecurityToken(
                 configuration["Jwt:Issuer"],
                 configuration["Jwt:Audience"],
                 claims,
                 expires: DateTime.Now.AddDays(1),
                 signingCredentials: credentials);
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(jwt_Token);
            return jwtToken;
        }
    }
}
