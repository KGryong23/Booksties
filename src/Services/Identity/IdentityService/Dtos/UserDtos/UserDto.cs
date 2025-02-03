namespace IdentityService.Dtos.UserDtos
{
    public record UserDto
    {
        public Guid UserId { get; init; }
        public string Email { get; init; } = null!;
        public string Password { get; init; } = null!;
        public string AuthMethod { get; init; } = null!;
        public bool IsActive { get; init; }
        public Guid RoleId { get; init; }
        public string RoleName { get; init; } = null!;
        public string? Address { get; init; }
        public int Reputation { get; init; }
    }

}
