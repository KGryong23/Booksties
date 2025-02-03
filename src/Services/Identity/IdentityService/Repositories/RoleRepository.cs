using System.Data;
using System.Text.Json;
using Dapper;
using IdentityService.Data;
using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Repositories;

public class RoleRepository(ISqlConnectionFactory connectionFactory) : IRoleRepository
{
    public async Task<bool> AddPermissionToRole(Guid RoleId, List<Guid> PermissionIds)
    {
        var jsonPermissions = JsonSerializer.Serialize(PermissionIds);
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@RoleId", RoleId);
            parameters.Add("@PermissionIds", jsonPermissions);
            await connection.ExecuteAsync(
                "AddPermissionsToRole",
                 parameters,
                 transaction,
                 commandType: CommandType.StoredProcedure
            );
            transaction.Commit();
            return true;
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            throw new Exception(ex.Message, ex);
        }
    }

    public async Task<bool> AddRole(string roleName)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                RoleName = roleName,
            };
            await connection.ExecuteAsync(
                "AddRole",
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

    public async Task<bool> DeleteRole(Guid id)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                RoleId = id,
            };
            await connection.ExecuteAsync(
                "DeleteRole",
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

    public async Task<IEnumerable<RoleDto>> GetAllRoles()
    {
        string query = "SELECT role_id as RoleId,role_name as RoleName FROM roles";
        using var connection = connectionFactory.Create();
        return await connection.QueryAsync<RoleDto>(query);
    }

    public async Task<Guid?> GetRoleIdWithName(string name)
    {
        string query = "SELECT role_id FROM roles WHERE role_name = @Name";
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<Guid>(
            query,
            new { Name = name }
        );
    }

    public async Task<string?> GetRoleName(Guid id)
    {
        string query = "SELECT role_name FROM roles WHERE role_id = @Id";
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<string?>(
            query,
            new { Id = id }
        );
    }

    public async Task<IEnumerable<RolePaginateDto>> GetRolePaginate(RolePaginationReq req)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@p_role_name", req.RoleName != "empty" ? req.RoleName : null, DbType.String);
        parameters.Add("@p_field", req.Field, DbType.String);
        parameters.Add("@p_order", req.Order?.Replace("?", ""), DbType.String);
        parameters.Add("@p_page", req.Page, DbType.Int32);
        parameters.Add("@p_limit", req.Limit, DbType.Int32);
        using var connection = connectionFactory.Create();
        var roles = await connection.QueryAsync<RolePaginateDto>(
            "PaginateRoles",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return roles;
    }

    public async Task<Guid?> GetRoleWithId(Guid id)
    {
        string query = "SELECT role_id FROM roles WHERE role_id = @Id";
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<Guid>(
            query,
            new { Id = id }
        );
    }

    public async Task<bool> UpdateRole(Guid id, string roleName)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                RoleId = id,
                RoleName = roleName
            };
            await connection.ExecuteAsync(
                "UpdateRole",
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

