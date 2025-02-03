using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Roles.Query.GetRolePaginate;
public record GetRolePaginateQuery(
    string? RoleName,
    string? Field,
    string? Order,
    int Limit = 5,
    int Page = 1
) : IQuery<IEnumerable<RolePaginateDto>>;
public class GetRolePaginateHandler
(IRoleRepository repo)
 : IQueryHandler<GetRolePaginateQuery, IEnumerable<RolePaginateDto>>
{
    public async Task<IEnumerable<RolePaginateDto>> Handle(GetRolePaginateQuery request, CancellationToken cancellationToken)
    {
        var query = request.Adapt<RolePaginationReq>();
        return await repo.GetRolePaginate(query);
    }
}


