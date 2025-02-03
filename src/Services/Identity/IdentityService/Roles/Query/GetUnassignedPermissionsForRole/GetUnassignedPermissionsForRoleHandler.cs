using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Roles.Query.GetUnassignedPermissionsForRole;
public record GetUnassignedPermissionsForRoleQuery(
    Guid Id
) : IQuery<IEnumerable<PermissionDto>>;
public class GetUnassignedPermissionsForRoleHandler
(IPermissionRepository repo)
 : IQueryHandler<GetUnassignedPermissionsForRoleQuery, IEnumerable<PermissionDto>>
{
    public async Task<IEnumerable<PermissionDto>> Handle(GetUnassignedPermissionsForRoleQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetUnassignedPermissionsForRole(request.Id);
    }
}



