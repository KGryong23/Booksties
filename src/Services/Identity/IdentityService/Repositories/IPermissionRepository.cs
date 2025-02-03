using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Repositories;

public interface IPermissionRepository
{
    Task<IEnumerable<PermissionDto>> GetPermissionsByRoleId(Guid id);
    Task<IEnumerable<PermissionDto>> GetUnassignedPermissionsForRole(Guid roleId);
    Task<bool> DeleteRolePermission(Guid RoleId, Guid PermissionId);
}


