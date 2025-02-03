using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Roles.Query;
public record GetAllRolesQuery() : IQuery<IEnumerable<RoleDto>>;
public class GetAllRolesHandler
(IRoleRepository repo)
 : IQueryHandler<GetAllRolesQuery, IEnumerable<RoleDto>>
{
    public async Task<IEnumerable<RoleDto>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetAllRoles();
    }
}


