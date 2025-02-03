using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Roles.Query.GetPermissionWithRole;
public record GetPermissionWithRoleQuery(
    Guid Id
) : IQuery<IEnumerable<PermissionDto>>;
public class GetPermissionWithRoleHandler
(IPermissionRepository repo)
 : IQueryHandler<GetPermissionWithRoleQuery, IEnumerable<PermissionDto>>
{
    public async Task<IEnumerable<PermissionDto>> Handle(GetPermissionWithRoleQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetPermissionsByRoleId(request.Id);
    }
}


