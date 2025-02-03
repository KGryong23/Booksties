namespace IdentityService.Dtos.RoleDtos;

public record RoleDto
{
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = null!;
}


