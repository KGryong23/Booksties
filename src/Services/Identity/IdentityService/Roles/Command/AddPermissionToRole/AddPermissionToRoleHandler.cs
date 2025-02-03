using CommonLib.Messaging.Events;
using MassTransit;

namespace IdentityService.Roles.Command.AddPermissionToRole;
public record AddPermissionToRoleCommand(
   Guid RoleId,
   List<Guid> PermissionIds
) : ICommand<bool>;
public class AddPermissionToRoleHandler
(IRoleRepository repo, IPublishEndpoint publish)
 : ICommandHandler<AddPermissionToRoleCommand, bool>
{
    public async Task<bool> Handle(AddPermissionToRoleCommand request, CancellationToken cancellationToken)
    {
        var result = await repo.AddPermissionToRole(request.RoleId, request.PermissionIds);
        if (result)
        {
            await publish.Publish(new RoleChanged { RoleId = request.RoleId });
        }
        return result;
    }
}



