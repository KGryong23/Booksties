namespace IdentityService.Users.Command.UpdateAddress;

public record UpdateAddressCommand(
      Guid Id,
      string Address
)
 : ICommand<bool>;
public class UpdateAddressHandler
 (IUserRepository userRepository)
 : ICommandHandler<UpdateAddressCommand, bool>
{
    public async Task<bool> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        return await userRepository.UpdateAddress(request.Id, request.Address);
    }
}



