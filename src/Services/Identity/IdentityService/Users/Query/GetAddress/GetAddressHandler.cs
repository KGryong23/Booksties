using IdentityService.Dtos;

namespace IdentityService.Users.Query.GetAddress;
public record GetAddressQuery(
    Guid id
) : IQuery<AddressDto?>;
public class GetAddressHandler
 (IUserRepository userRepository)
 : IQueryHandler<GetAddressQuery, AddressDto?>
{
    public async Task<AddressDto?> Handle(GetAddressQuery request, CancellationToken cancellationToken)
    {
        return await userRepository.GetAddressByUser(request.id);
    }
}


