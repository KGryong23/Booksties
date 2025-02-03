CREATE PROCEDURE AddRole
    @RoleName NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM roles WHERE role_name = @RoleName)
    BEGIN
        INSERT INTO roles (role_name)
        VALUES (@RoleName);
    END
    ELSE
    BEGIN
        PRINT 'Role name already exists.';
    END
END;

CREATE PROCEDURE UpdateRole
    @RoleId UNIQUEIDENTIFIER,
    @RoleName NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM roles WHERE role_id = @RoleId)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM roles WHERE role_name = @RoleName AND role_id != @RoleId)
        BEGIN
            UPDATE roles
            SET role_name = @RoleName,
                updated_at = SYSDATETIME()
            WHERE role_id = @RoleId;
        END
        ELSE
        BEGIN
            PRINT 'Role name already exists for another role.';
        END
    END
    ELSE
    BEGIN
        PRINT 'Role ID does not exist.';
    END
END;

CREATE PROCEDURE DeleteRole
    @RoleId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM roles WHERE role_id = @RoleId)
    BEGIN
        DELETE FROM roles
        WHERE role_id = @RoleId;
    END
    ELSE
    BEGIN
        PRINT 'Role ID does not exist.';
    END
END;

GO
CREATE PROCEDURE AddPermissionsToRole
    @RoleId UNIQUEIDENTIFIER,
    @PermissionIds NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = @RoleId)
    BEGIN
        THROW 50000, 'Role ID does not exist.', 1;
    END

    IF ISJSON(@PermissionIds) = 0
    BEGIN
        THROW 50000, 'PermissionIds must be a valid JSON array.', 1;
    END

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT DISTINCT
        @RoleId AS role_id,
        TRY_CONVERT(UNIQUEIDENTIFIER, [value]) AS permission_id
    FROM OPENJSON(@PermissionIds)
    WHERE TRY_CONVERT(UNIQUEIDENTIFIER, [value]) IS NOT NULL
      AND NOT EXISTS (
          SELECT 1
          FROM role_permissions
          WHERE role_id = @RoleId
            AND permission_id = TRY_CONVERT(UNIQUEIDENTIFIER, [value])
      );
END;
GO




go
CREATE PROCEDURE DeleteRolePermission
    @RoleId UNIQUEIDENTIFIER,
    @PermissionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM role_permissions
    WHERE role_id = @RoleId AND permission_id = @PermissionId;

    IF @@ROWCOUNT = 0
    BEGIN
        THROW 50000, 'The role_permission record does not exist.', 1;
    END
END;
go

GO
CREATE PROCEDURE dbo.PaginateRoles(
    @p_role_name NVARCHAR(255) = NULL,
    @p_field NVARCHAR(50) = 'role_id',
    @p_order NVARCHAR(4) = 'asc',
    @p_page INT = 1,
    @p_limit INT = 10
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Tính offset cho phân trang
    DECLARE @Offset INT = (@p_page - 1) * @p_limit;

    -- Tạo câu lệnh SQL động
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @Params NVARCHAR(MAX);

    SET @Sql = '
    SELECT 
        role_id AS RoleId,
        role_name AS RoleName,
        created_at AS CreatedAt,
        updated_at AS UpdatedAt
    FROM 
        roles
    WHERE 
        (@p_role_name IS NULL OR role_name LIKE ''%'' + @p_role_name + ''%'')
    ORDER BY ' + 
        CASE 
            WHEN @p_field = 'role_name' THEN 'role_name'
            WHEN @p_field = 'created_at' THEN 'created_at'
            WHEN @p_field = 'updated_at' THEN 'updated_at'
            ELSE 'role_id'
        END + ' ' + 
        CASE 
            WHEN @p_order = 'desc' THEN 'DESC'
            ELSE 'ASC'
        END + '
    OFFSET @Offset ROWS 
    FETCH NEXT @p_limit ROWS ONLY;';

    -- Xác định tham số đầu vào
    SET @Params = N'@p_role_name NVARCHAR(255), @Offset INT, @p_limit INT';

    -- Thực thi SQL động
    EXEC sp_executesql @Sql, @Params, @p_role_name, @Offset, @p_limit;
END;
GO



DROP PROCEDURE AddPermissionsToRole

DECLARE @RoleId UNIQUEIDENTIFIER = '76c1193e-ce0c-4b88-92b2-47b8cbc25f83';
DECLARE @PermissionIds NVARCHAR(MAX) = '["33e26963-f3dd-495f-b0d7-2da56ed7f78a"]';

EXEC AddPermissionsToRole @RoleId, @PermissionIds;
