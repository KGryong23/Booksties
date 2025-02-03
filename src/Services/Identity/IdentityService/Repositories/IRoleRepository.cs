using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Repositories;

public interface IRoleRepository
{
    Task<Guid?> GetRoleIdWithName(string name);
    Task<Guid?> GetRoleWithId(Guid id);
    Task<IEnumerable<RoleDto>> GetAllRoles();
    Task<bool> AddRole(string roleName);
    Task<bool> UpdateRole(Guid id, string roleName);
    Task<bool> DeleteRole(Guid id);
    Task<bool> AddPermissionToRole(Guid RoleId, List<Guid> PermissionIds);
    Task<IEnumerable<RolePaginateDto>> GetRolePaginate(RolePaginationReq req);
    Task<string?> GetRoleName(Guid id);
}

