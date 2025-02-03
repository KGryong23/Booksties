using IdentityService.Dtos.UserNameDto;

namespace IdentityService.Users.Query.GetUserName;
public record GetUserNameQuery(Guid id) : IQuery<UserNameDto?>;
public class GetUserNameHandler
(IUserRepository repo)
 : IQueryHandler<GetUserNameQuery, UserNameDto?>
{
    public async Task<UserNameDto?> Handle(GetUserNameQuery request, CancellationToken cancellationToken)
    {
        return await repo.GetUserNameById(request.id);
    }
}


