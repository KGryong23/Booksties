namespace IdentityService.Dtos.RoleDtos;

public record RolePaginateDto
{
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}


