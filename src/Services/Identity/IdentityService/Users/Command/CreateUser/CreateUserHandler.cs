using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Command.CreateUser
{
    public record CreateUserCommand(
        string Email,
        string Password,
        string Auth,
        string Role
    ) : ICommand<CreateUserResult>;
    public record CreateUserResult(bool Status);
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email must be a valid email address");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long");
            RuleFor(x => x.Auth)
                .NotEmpty().WithMessage("Auth is required")
                .Must(auth => auth == "credentials")
                .WithMessage("Auth must be either 'credentials'");
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required");
        }
    };
    internal class CreateUserHandler(IUserRepository userRepository)
        : ICommandHandler<CreateUserCommand, CreateUserResult>
    {
        public async Task<CreateUserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = request.Adapt<CreateUserDto>();
            return new CreateUserResult(await userRepository.CreateUser(user));
        }
    }
}


