using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Query.UserLoginSM
{
    public record UserLoginSMQuery(string Email, string Auth) : IQuery<UserLoginRes>;
    public class UserLoginSMQueryValidator : AbstractValidator<UserLoginSMQuery>
    {
        public UserLoginSMQueryValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email must be a valid email address");
            RuleFor(x => x.Auth)
                .NotEmpty().WithMessage("Password is required")
                .Must(auth => auth == "github" || auth == "google")
                .WithMessage("Auth must be either 'github' or 'google'");
        }
    };

    internal class UserLoginSMHandler(IUserRepository userRepository) : IQueryHandler<UserLoginSMQuery, UserLoginRes>
    {
        public async Task<UserLoginRes> Handle(UserLoginSMQuery request, CancellationToken cancellationToken)
        {
            var req = request.Adapt<SocialMediaReq>();
            return await userRepository.SigninSocialMedia(req);
        }
    }
}




