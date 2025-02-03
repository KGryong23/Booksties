namespace IdentityService.Dtos.UserDtos;
public record ListUserDto
{
    public Guid UserId { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }
    public string? AuthMethod { get; init; }
    public bool IsActive { get; init; }
    public DateTime UpdatedAt { get; init; }
    public string? Address { get; init; }
    public int Reputation { get; init; }
    public string? RoleName { get; init; }
}

