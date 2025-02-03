GO
CREATE PROCEDURE dbo.Upsert_token
    @UserId UNIQUEIDENTIFIER,
    @Token NVARCHAR(MAX) = NULL,
    @ExpiresAt DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM tokens WHERE user_id = @UserId)
    BEGIN
        UPDATE tokens
        SET 
            token = ISNULL(@Token, token),
            expires_at = ISNULL(@ExpiresAt, expires_at),
            is_revoked = 0,
            created_at = SYSDATETIME()
        WHERE user_id = @UserId;
    END
    ELSE
    BEGIN
        INSERT INTO tokens (user_id, token, expires_at, created_at)
        VALUES (@UserId, @Token, @ExpiresAt, SYSDATETIME());
    END
END;
GO

GO
CREATE PROCEDURE dbo.Token_recovery
    @TokenId UNIQUEIDENTIFIER,
    @IsRevoked BIT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN
        UPDATE tokens
        SET is_revoked = @IsRevoked
        WHERE token_id = @TokenId;
    END
END;
GO

GO
CREATE PROCEDURE dbo.Delete_token
    @TokenId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN
        DELETE FROM tokens
        WHERE token_id = @TokenId;
    END
END;
GO

GO
CREATE PROCEDURE dbo.Delete_token_by_userId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN
       DELETE FROM tokens
       WHERE user_id = @UserId;
    END
END;
GO

DROP PROCEDURE dbo.Delete_token

