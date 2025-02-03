using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Query.GetListUser
{
    public record GetListUserQuery(
        string? Email,
        string? AuthMethod,
        string? Field,
        string? Order,
        int Limit = 1,
        int Page = 5
    ) : IQuery<PaginatedResult<ListUserDto>>;
    internal class GetListUserHandler(IUserRepository userRepository)
        : IQueryHandler<GetListUserQuery, PaginatedResult<ListUserDto>>
    {
        public async Task<PaginatedResult<ListUserDto>> Handle(GetListUserQuery request, CancellationToken cancellationToken)
        {
            var query = request.Adapt<UserPaginationReq>();
            var listUser = await userRepository.GetUserPagination(query);
            return listUser;
        }
    }
}

