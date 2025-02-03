using System.Data;
using Dapper;
using IdentityService.Data;
using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Repositories;
public class PermissionRepository
  (ISqlConnectionFactory connectionFactory)
 : IPermissionRepository
{
    public async Task<bool> DeleteRolePermission(Guid RoleId, Guid PermissionId)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@RoleId", RoleId);
            parameters.Add("@PermissionId", PermissionId);
            await connection.ExecuteAsync(
                "DeleteRolePermission",
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

    public async Task<IEnumerable<PermissionDto>> GetUnassignedPermissionsForRole(Guid roleId)
    {
        const string query = @"
            SELECT p.permission_id as PermissionId,
                   p.permission_name as PermissionName,
                   p.description as Description,
                   p.created_at as CreatedAt
            FROM permissions p
            WHERE NOT EXISTS (
                SELECT 1
                FROM role_permissions rp
                WHERE rp.permission_id = p.permission_id AND rp.role_id = @RoleId
            );
        ";
        using var connection = connectionFactory.Create();
        return await connection.QueryAsync<PermissionDto>(query, new { RoleId = roleId });
    }

    public async Task<IEnumerable<PermissionDto>> GetPermissionsByRoleId(Guid id)
    {
        string query = """
           SELECT p.permission_id as PermissionId,
                  p.permission_name as PermissionName,
                  p.description as Description,
                  p.created_at as CreatedAt
           FROM permissions p
           INNER JOIN role_permissions rp ON p.permission_id = rp.permission_id
           WHERE rp.role_id = @Id
        """;
        using var connection = connectionFactory.Create();
        return await connection.QueryAsync<PermissionDto>(
            query,
            new { Id = id }
        );
    }
}


