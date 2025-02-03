IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'IdentityDb')
BEGIN
    CREATE DATABASE IdentityDb;
END
GO

USE IdentityDb

CREATE TABLE roles (
    role_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role_name NVARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT SYSDATETIME(),
    updated_at DATETIME DEFAULT SYSDATETIME()
);

CREATE TABLE users (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    auth_method NVARCHAR(50) NOT NULL,
    CONSTRAINT chk_auth_method CHECK (auth_method IN ('credentials', 'github', 'google')),
    is_active BIT NOT NULL DEFAULT 1,
    role_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES roles(role_id),
    created_at DATETIME DEFAULT SYSDATETIME(),
    updated_at DATETIME DEFAULT SYSDATETIME()
);

CREATE TABLE tokens (
    token_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    token NVARCHAR(MAX) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT SYSDATETIME(),
    is_revoked BIT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id)
);

CREATE TABLE permissions (
    permission_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    permission_name VARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(500) NULL,
    created_at DATETIME DEFAULT SYSDATETIME(),
    updated_at DATETIME DEFAULT SYSDATETIME()
);

CREATE TABLE role_permissions (
    role_id UNIQUEIDENTIFIER NOT NULL,
    permission_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT PK_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_role_permissions_roles FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    CONSTRAINT FK_role_permissions_permissions FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

CREATE TABLE wallets (
    wallet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), 
    user_id UNIQUEIDENTIFIER NOT NULL UNIQUE,              
    balance DECIMAL(18, 2) DEFAULT 0,                      
    created_at DATETIME DEFAULT GETDATE(),                 
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE wallet_transactions (
    transaction_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), 
    wallet_id UNIQUEIDENTIFIER NOT NULL,                        
    amount DECIMAL(18, 2) NOT NULL,                            
    description NVARCHAR(255),                                  
    created_at DATETIME DEFAULT GETDATE(),                      
    FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id) ON DELETE CASCADE     
);

ALTER TABLE users
ADD address NVARCHAR(500),  
    reputation INT NOT NULL DEFAULT 100; 


INSERT INTO roles (role_id, role_name)
VALUES 
    (NEWID(), 'Admin'),
    (NEWID(), 'User');

