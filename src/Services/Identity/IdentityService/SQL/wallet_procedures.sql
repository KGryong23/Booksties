GO
CREATE PROCEDURE CreateWallet
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wallets WHERE user_id = @UserId)
    BEGIN
        INSERT INTO wallets (user_id, balance)
        VALUES (@UserId, 0);
    END
    ELSE
    BEGIN
        THROW 50001, 'Ví đã tồn tại cho người dùng này', 1;
    END
END;
GO

GO
CREATE PROCEDURE TopUpWallet
    @UserId UNIQUEIDENTIFIER,
    @Amount DECIMAL(18, 2)
AS
BEGIN
    BEGIN TRANSACTION;

    IF EXISTS (SELECT 1 FROM wallets WHERE user_id = @UserId)
    BEGIN
        UPDATE wallets
        SET balance = balance + @Amount, updated_at = GETDATE()
        WHERE user_id = @UserId;

        INSERT INTO wallet_transactions (wallet_id, amount, description)
        VALUES (
            (SELECT wallet_id FROM wallets WHERE user_id = @UserId),
            @Amount,
            'Nạp tiền vào ví'
        );

        COMMIT TRANSACTION;
    END
    ELSE
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50002, 'Ví không tồn tại', 1;
    END
END;
GO

GO
CREATE PROCEDURE PayOrder
    @UserId UNIQUEIDENTIFIER,
    @OrderAmount DECIMAL(18, 2),
    @Description NVARCHAR(255) 
AS
BEGIN
    BEGIN TRANSACTION;

    DECLARE @CurrentBalance DECIMAL(18, 2);
    SET @CurrentBalance = (SELECT balance FROM wallets WHERE user_id = @UserId);

    IF @CurrentBalance >= @OrderAmount
    BEGIN

        UPDATE wallets
        SET balance = balance - @OrderAmount, updated_at = GETDATE()
        WHERE user_id = @UserId;

        INSERT INTO wallet_transactions (wallet_id, amount, description)
        VALUES (
            (SELECT wallet_id FROM wallets WHERE user_id = @UserId),
            -@OrderAmount,
            @Description
        );

        COMMIT TRANSACTION;
    END
    ELSE
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50003, 'Số dư không đủ để thanh toán', 1;
    END
END;
GO

GO
CREATE PROCEDURE RefundTransaction
    @UserId UNIQUEIDENTIFIER,
    @RefundAmount DECIMAL(18, 2),
    @Description NVARCHAR(255) 
AS
BEGIN
    BEGIN TRANSACTION;

    IF EXISTS (SELECT 1 FROM wallets WHERE user_id = @UserId)
    BEGIN
        UPDATE wallets
        SET balance = balance + @RefundAmount, updated_at = GETDATE()
        WHERE user_id = @UserId;

        INSERT INTO wallet_transactions (wallet_id, amount, description)
        VALUES (
            (SELECT wallet_id FROM wallets WHERE user_id = @UserId),
            @RefundAmount,
            @Description
        );
        COMMIT TRANSACTION;
    END
    ELSE
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50004, 'Ví không tồn tại, không thể hoàn tiền', 1;
    END
END;
GO