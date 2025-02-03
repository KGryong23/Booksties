using CommonLib.Exceptions;

namespace IdentityService.Exceptions
{
    public class UserBadRequestException : BadRequestException
    {
        public UserBadRequestException(string message) : base("User", message)
        {

        }
    }
}
