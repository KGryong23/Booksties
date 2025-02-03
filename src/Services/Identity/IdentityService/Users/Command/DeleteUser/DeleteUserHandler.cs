namespace IdentityService.Users.Command.DeleteUser
{
    public record DeleteUserCommand(Guid Id) : ICommand<DeleteUserResult>;
    public record DeleteUserResult(bool Status);
    public class DeleteUserValidator : AbstractValidator<DeleteUserCommand>
    {
        public DeleteUserValidator()
        {
            RuleFor(x => x.Id)
              .NotEmpty().WithMessage("UserId is required");
        }
    }
    internal class DeleteUserHandler(IUserRepository userRepository)
        : ICommandHandler<DeleteUserCommand, DeleteUserResult>
    {
        public async Task<DeleteUserResult> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var result = await userRepository.DeleteUser(request.Id);
            return new DeleteUserResult(result);
        }
    }
}

