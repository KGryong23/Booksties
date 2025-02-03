GO
CREATE PROCEDURE dbo.InsertUser
    @UserId UNIQUEIDENTIFIER,
    @Email NVARCHAR(255),
    @Password NVARCHAR(255),
    @AuthMethod NVARCHAR(50),
    @Role UNIQUEIDENTIFIER
AS
BEGIN
    INSERT INTO users (user_id ,email,password,auth_method,role_id)
    VALUES (@UserId ,@Email , @Password , @AuthMethod, @Role);
END;
GO

GO
CREATE PROCEDURE dbo.PaginateUsers(
    @p_email NVARCHAR(255) = NULL,
    @p_auth_method NVARCHAR(50) = NULL,
    @p_field NVARCHAR(50) = 'user_id',
    @p_order NVARCHAR(4) = 'asc',
    @p_page INT = 1,
    @p_limit INT = 10
)
AS
BEGIN
    DECLARE @Offset INT = (@p_page - 1) * @p_limit;
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @Params NVARCHAR(MAX);

    SET @Sql = '
    SELECT 
        u.user_id as UserId,
        u.email as Email,
        u.password as Password,
        u.auth_method as AuthMethod,
        u.is_active as IsActive,
        u.updated_at as UpdatedAt,
        u.address as Address,
        u.reputation as Reputation,
        r.role_name as RoleName
    FROM 
        users u
    INNER JOIN 
        roles r ON r.role_id = u.role_id
    WHERE 
        (@p_email IS NULL OR u.email LIKE ''%'' + @p_email + ''%'')
        AND (@p_auth_method IS NULL OR u.auth_method = @p_auth_method)
    ORDER BY ' + 
        CASE 
            WHEN @p_field = 'email' THEN 'u.email'
            WHEN @p_field = 'user_id' THEN 'u.user_id'
            ELSE 'u.user_id'
        END + ' ' + 
        CASE 
            WHEN @p_order = 'desc' THEN 'DESC'
            ELSE 'ASC'
        END + '
    OFFSET @Offset ROWS 
    FETCH NEXT @p_limit ROWS ONLY;';

    SET @Params = N'@p_email NVARCHAR(255), @p_auth_method NVARCHAR(50), @Offset INT, @p_limit INT';

    EXEC sp_executesql @Sql, @Params, @p_email, @p_auth_method, @Offset, @p_limit;
END;
GO

GO
CREATE PROCEDURE dbo.UpdateUser
    @p_user_id UNIQUEIDENTIFIER,          
    @p_address NVARCHAR(500) = NULL,          
    @p_is_active BIT = NULL,              
    @p_role_id UNIQUEIDENTIFIER = NULL,
    @p_reputation INT = NULL   
AS
BEGIN
    UPDATE users
    SET
        address = COALESCE(@p_address, address),
        reputation = COALESCE(@p_reputation,reputation),
        is_active = COALESCE(@p_is_active, is_active), 
        role_id = COALESCE(@p_role_id, role_id), 
        updated_at = SYSDATETIME()               
    WHERE
        user_id = @p_user_id;                   
END;
GO

GO
CREATE PROCEDURE dbo.DeleteUserById
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
     DELETE FROM users
     WHERE user_id = @UserId;
END;
GO


-- DROP PROCEDURE dbo.DeleteUserById

DROP PROCEDURE dbo.PaginateUsers;

-- DROP PROCEDURE dbo.InsertUser; 

DROP PROCEDURE dbo.UpdateUser;
