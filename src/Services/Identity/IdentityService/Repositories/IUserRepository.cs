using IdentityService.Dtos;
using IdentityService.Dtos.UserDtos;
using IdentityService.Dtos.UserNameDto;

namespace IdentityService.Repositories
{
    public interface IUserRepository
    {
        Task<bool> CreateUser(CreateUserDto user);
        Task<UserLoginRes> Signin(UserLoginReq user);
        Task<UserLoginRes> SigninSocialMedia(SocialMediaReq social);
        Task<UserLoginRes> RefreshToken(Guid id, string token);
        Task<PaginatedResult<ListUserDto>> GetUserPagination(UserPaginationReq request);
        Task<bool> DeleteUser(Guid id);
        Task<bool> UpdateUser(UpdateUserDto userDto);
        Task<bool> UpdateAddress(Guid id, string address);
        Task<AddressDto?> GetAddressByUser(Guid id);
        Task<UserNameDto?> GetUserNameById(Guid id);
        Task<Guid?> GetRoleIdWithUser(Guid id);
    }
}


