using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Query.UserLogin
{
    public record UserLoginQuery(string Email, string Password) : IQuery<UserLoginRes>;
    public class UserLoginQueryValidator : AbstractValidator<UserLoginQuery>
    {
        public UserLoginQueryValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
        }
    };
    internal class UserLoginHandler
        (IUserRepository userRepository)
        : IQueryHandler<UserLoginQuery, UserLoginRes>
    {
        public async Task<UserLoginRes> Handle(UserLoginQuery request, CancellationToken cancellationToken)
        {
            var user = request.Adapt<UserLoginReq>();
            return await userRepository.Signin(user);
        }
    }
}

