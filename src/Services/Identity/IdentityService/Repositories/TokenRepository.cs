using Dapper;
using System.Data;
using IdentityService.Data;
using IdentityService.Dtos.TokenDtos;

namespace IdentityService.Repositories
{
    public class TokenRepository
        (ISqlConnectionFactory connectionFactory)
        : ITokenRepository
    {
        public async Task<bool> CheckTokenByUserId(Guid userId, string token)
        {
            var query = @"
                SELECT 
                    token_id as TokenId,
                    user_id as UserId,
                    token as Token,
                    expires_at as ExpiresAt,
                    created_at as CreatedAt,
                    is_revoked as IsRevoked
                FROM tokens
                WHERE user_id = @UserId
                  AND token = @Token
                  AND expires_at > GETDATE()
                  AND is_revoked = 0";
            using var connection = connectionFactory.Create();
            var refreshToken = await connection.QueryFirstOrDefaultAsync<TokenDto>(
            query,
                new { UserId = userId, Token = token }
            );
            if (refreshToken == null) return false;
            return true;
        }

        public async Task<bool> CreateRefreshToken(Guid userId, string token)
        {
            using var connection = connectionFactory.Create();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            try
            {
                var parameters = new
                {
                    UserId = userId,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(1)
                };
                await connection.ExecuteAsync(
                    "dbo.Upsert_token",
                    parameters,
                    transaction,
                    commandType: CommandType.StoredProcedure
                );
                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                return false;
            }
        }

        public async Task<bool> DeleteTokenByUserId(Guid userId)
        {
            using var connection = connectionFactory.Create();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            try
            {
                var parameters = new
                {
                    UserId = userId
                };
                await connection.ExecuteAsync(
                    "dbo.Delete_token_by_userId",
                     parameters,
                     transaction,
                     commandType: CommandType.StoredProcedure
                );
                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                return false;
            }
        }
    }
}
