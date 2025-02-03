namespace IdentityService.Dtos.PermissionDtos;

public record class PermissionDto
{
    public Guid PermissionId { get; set; }
    public string? PermissionName { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
