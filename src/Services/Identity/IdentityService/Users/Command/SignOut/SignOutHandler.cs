namespace IdentityService.Users.Command.SignOut
{
    public record SignOutCommand(Guid id) : ICommand<bool>;
    internal class SignOutHandler
        (ITokenRepository tokenRepository)
        : ICommandHandler<SignOutCommand, bool>
    {
        public async Task<bool> Handle(SignOutCommand request, CancellationToken cancellationToken)
        {
            var result = await tokenRepository.DeleteTokenByUserId(request.id);
            return result;
        }
    }
}

