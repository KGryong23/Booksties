using CommonLib.Messaging.Events;
using IdentityService.Dtos.UserDtos;
using MassTransit;

namespace IdentityService.Users.Command.UpdateUser;

public record UpdateUserCommand(
    Guid UserId,
    string Address,
    bool IsActive,
    Guid RoleId,
    int Reputation
) : ICommand<UpdateUserResult>;
public record UpdateUserResult(bool Status);
public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
           .NotEmpty().WithMessage("UserId is required");
        RuleFor(x => x.RoleId)
           .NotEmpty().WithMessage("RoleId is required");
    }
}
internal class UpdateUserHandler(IUserRepository userRepository, IPublishEndpoint publish)
    : ICommandHandler<UpdateUserCommand, UpdateUserResult>
{
    public async Task<UpdateUserResult> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var data = request.Adapt<UpdateUserDto>();
        var check = await userRepository.GetRoleIdWithUser(request.UserId);
        var result = await userRepository.UpdateUser(data);
        if (check != request.RoleId && result)
        {
            await publish.Publish(new UserRoleChanged { UserId = request.UserId });
        }
        return new UpdateUserResult(result);
    }
}

