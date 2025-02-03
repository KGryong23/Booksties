using Dapper;
using System.Data;
using IdentityService.Data;
using IdentityService.Dtos.UserDtos;
using IdentityService.Services;
using IdentityService.Dtos;
using IdentityService.Dtos.UserNameDto;

namespace IdentityService.Repositories;

public class UserRepository(
    ISqlConnectionFactory connectionFactory,
    IRoleRepository role,
    ITokenRepository tokenRepository,
    IPermissionRepository permissionRepository,
    IPasswordService password,
    IJwtService jwtService
) : IUserRepository
{
    public async Task<bool> CreateUser(CreateUserDto user)
    {
        Guid? roleId = await role.GetRoleIdWithName(user.Role);
        if (roleId is null)
        {
            return false;
        }
        return await Save(user, roleId.ToString());
    }
    private async Task<bool> Save(CreateUserDto user, string? roleId)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var userId = Guid.NewGuid();
            var parameters1 = new
            {
                UserId = userId,
                Email = user.Email,
                Password = password.HashPassword(user.Password),
                AuthMethod = user.Auth,
                Role = roleId
            };
            await connection.ExecuteAsync(
                "dbo.InsertUser",
                 parameters1,
                 transaction,
                 commandType: CommandType.StoredProcedure
            );
            await connection.ExecuteAsync("CreateWallet", new { UserId = userId }, transaction, commandType: CommandType.StoredProcedure);
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            return false;
        }
    }
    private async Task<UserDto?> GetUserWithRole(string email)
    {
        string query = """
                SELECT u.user_id as UserId,
                       u.email as Email,
                       u.password as Password,
                       u.auth_method as AuthMethod,
                       u.is_active as IsActive,
                       u.role_id as RoleId,
                       r.role_name as RoleName,
                       u.address as Address,
                       u.reputation as Reputation
                FROM users u 
                INNER JOIN roles r ON u.role_id = r.role_id
                WHERE u.email = @Email
            """;
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<UserDto?>(
            query,
            new { Email = email }
        );
    }
    public async Task<UserLoginRes> Signin(UserLoginReq user)
    {
        var userRole = await GetUserWithRole(user.Email);
        if (userRole is null)
            return new UserLoginRes("", "", 0, null);
        if (password.VerifyPassword(userRole.Password, user.Password) == false)
            return new UserLoginRes("", "", 0, null);
        if (userRole.IsActive == false)
            return new UserLoginRes("", "", 0, null);
        var permissions = await permissionRepository.GetPermissionsByRoleId(
            userRole.RoleId
        );
        var access_token = jwtService.GenerateAccessToken(
            userRole.UserId,
            userRole.RoleName,
            permissions
        );
        var refresh_token = jwtService.GenerateRefreshToken(userRole.UserId);
        var check = await tokenRepository.CreateRefreshToken(
            userRole.UserId,
            refresh_token
        );
        if (check == false)
            return new UserLoginRes("", "", 0, null);
        return new UserLoginRes(
               access_token,
               refresh_token,
               600,
               new UserNoPasswordDto(
                   userRole.UserId,
                   userRole.Email,
                   userRole.AuthMethod,
                   userRole.IsActive,
                   userRole.RoleName,
                   userRole.Address,
                   userRole.Reputation,
                   userRole.RoleId
              )
        );
    }
    public async Task<UserLoginRes> SigninSocialMedia(SocialMediaReq social)
    {
        var user = await GetUserWithRole(social.Email);
        if (user is null)
        {
            Guid? roleId = await role.GetRoleIdWithName("User");
            if (roleId is null)
                return new UserLoginRes("", "", 0, null);
            CreateUserDto data = new CreateUserDto
            (
                 social.Email,
                 "2003",
                 social.Auth,
                 "User"
            );
            var check = await Save(data, roleId.ToString());
            if (check == false)
                return new UserLoginRes("", "", 0, null);
            user = await GetUserWithRole(social.Email);
        }
        if (user!.IsActive == false)
            return new UserLoginRes("", "", 0, null);
        if (password.VerifyPassword(user.Password, "2003") == false)
            return new UserLoginRes("", "", 0, null);
        var permissions = await permissionRepository.GetPermissionsByRoleId(
            user.RoleId
        );
        var access_token = jwtService.GenerateAccessToken(
            user.UserId,
            user.RoleName,
            permissions
        );
        var refresh_token = jwtService.GenerateRefreshToken(user.UserId);
        var checkToken = await tokenRepository.CreateRefreshToken(
            user.UserId,
            refresh_token
        );
        if (checkToken == false)
            return new UserLoginRes("", "", 0, null);
        return new UserLoginRes(
             access_token,
             refresh_token,
             600,
             new UserNoPasswordDto(
                 user.UserId,
                 user.Email,
                 user.AuthMethod,
                 user.IsActive,
                 user.RoleName,
                 user.Address,
                 user.Reputation,
                 user.RoleId
             )
        );
    }

    public async Task<PaginatedResult<ListUserDto>> GetUserPagination(
        UserPaginationReq request
    )
    {
        var parameters = new
        {
            p_email = request.Email != "empty" ? request.Email : null,
            p_auth_method = request.AuthMethod != "empty" ? request.AuthMethod : null,
            p_field = request.Field,
            p_order = request.Order?.Replace("?", ""),
            p_page = request.Page,
            p_limit = request.Limit,
        };
        using var connection = connectionFactory.Create();
        var listUser = await connection.QueryAsync<ListUserDto>(
                "dbo.PaginateUsers",
                 parameters,
                 commandType: CommandType.StoredProcedure
        );
        return new PaginatedResult<ListUserDto>(
            request.Page,
            request.Limit,
            listUser.Count(),
            listUser
        );
    }

    public async Task<bool> DeleteUser(Guid id)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                UserId = id,
            };
            await connection.ExecuteAsync(
                "dbo.DeleteUserById",
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

    public async Task<bool> UpdateUser(UpdateUserDto userDto)
    {
        Guid? roleId = await role.GetRoleWithId(userDto.RoleId);
        if (roleId is null)
            return false;
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var parameters = new
            {
                p_user_id = userDto.UserId,
                p_address = (object)userDto.Address ?? DBNull.Value,
                p_is_active = (object)userDto.IsActive ?? DBNull.Value,
                p_role_id = (object)roleId ?? DBNull.Value,
                p_reputation = (object)userDto.Reputation ?? DBNull.Value
            };
            await connection.ExecuteAsync(
                "dbo.UpdateUser",
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

    public async Task<UserLoginRes> RefreshToken(Guid id, string token)
    {
        var user = await GetUserById(id);
        if (user is null)
            return new UserLoginRes("", "", 0, null);
        var check_1 = await tokenRepository.CheckTokenByUserId(id, token);
        if (check_1 == false)
            return new UserLoginRes("", "", 0, null);
        var permissions = await permissionRepository.GetPermissionsByRoleId(
            user.RoleId
        );
        var access_token = jwtService.GenerateAccessToken(
            user.UserId,
            user.RoleName,
            permissions
        );
        var refresh_token = jwtService.GenerateRefreshToken(user.UserId);
        var check_2 = await tokenRepository.CreateRefreshToken(id, refresh_token);
        if (check_2 == false)
            return new UserLoginRes("", "", 0, null);
        return new UserLoginRes(
            access_token,
            refresh_token,
            600,
            new UserNoPasswordDto(
               user.UserId,
               user.Email,
               user.AuthMethod,
               user.IsActive,
               user.RoleName,
               user.Address,
               user.Reputation,
               user.RoleId
            )
       );
    }
    public async Task<UserDto?> GetUserById(Guid id)
    {
        string query = """
                SELECT u.user_id as UserId,
                       u.email as Email,
                       u.password as Password,
                       u.auth_method as AuthMethod,
                       u.is_active as IsActive,
                       u.role_id as RoleId,
                       r.role_name as RoleName,
                       u.address as Address,
                       u.reputation as Reputation
                FROM users u 
                INNER JOIN roles r ON u.role_id = r.role_id
                WHERE u.user_id = @Id AND is_active = 1
            """;
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<UserDto?>(
            query,
            new { Id = id }
        );
    }

    public async Task<bool> UpdateAddress(Guid id, string address)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            string query = """
                        UPDATE users
                        SET address = @Address, updated_at = SYSDATETIME()
                        WHERE user_id = @Id
                    """;
            var rowsAffected = await connection.ExecuteAsync(query, new { Id = id, Address = address }, transaction);
            transaction.Commit();
            return rowsAffected > 0;
        }
        catch (Exception)
        {
            transaction.Rollback();
            return false;
        }
    }

    public async Task<AddressDto?> GetAddressByUser(Guid id)
    {
        string query = """
                SELECT u.address as Address, u.reputation as Reputation
                FROM users u
                WHERE u.user_id = @UserId
            """;
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<AddressDto?>(
            query,
            new { UserId = id }
        );
    }

    public async Task<UserNameDto?> GetUserNameById(Guid id)
    {
        string query = """
                SELECT u.email as Email
                FROM users u
                WHERE u.user_id = @UserId
            """;
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<UserNameDto?>(
            query,
            new { UserId = id }
        );
    }

    public async Task<Guid?> GetRoleIdWithUser(Guid id)
    {
        string query = """
                SELECT role_id
                FROM users 
                WHERE user_id = @Id 
            """;
        using var connection = connectionFactory.Create();
        return await connection.QueryFirstOrDefaultAsync<Guid?>(
            query,
            new { Id = id }
        );
    }
}

