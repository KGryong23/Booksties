using CommonLib.Exceptions;
namespace IdentityService.Exceptions
{
    public class UserNotFoundException : NotFoundException
    {
        public UserNotFoundException(Guid Id) : base("User", Id)
        {
        }
    }
}
