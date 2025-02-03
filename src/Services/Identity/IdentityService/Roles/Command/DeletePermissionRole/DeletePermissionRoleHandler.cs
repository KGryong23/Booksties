using CommonLib.Messaging.Events;
using MassTransit;

namespace IdentityService.Roles.Command.DeletePermissionRole;
public record DeletePermissionRoleCommand(
    Guid RoleId,
    Guid PermissionId
) : ICommand<bool>;
public class DeletePermissionRoleHandler
(IPermissionRepository repo, IPublishEndpoint publish)
 : ICommandHandler<DeletePermissionRoleCommand, bool>
{
    public async Task<bool> Handle(DeletePermissionRoleCommand request, CancellationToken cancellationToken)
    {
        var result = await repo.DeleteRolePermission(request.RoleId, request.PermissionId);
        if (result)
        {
            await publish.Publish(new RoleChanged { RoleId = request.RoleId });
        }
        return result;
    }
}



