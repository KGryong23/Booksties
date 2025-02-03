namespace IdentityService.Roles.Command.DeleteRole;
public record DeleteRoleCommand(
    Guid Id
) : ICommand<bool>;
public class DeleteRoleHandler
(IRoleRepository repo)
 : ICommandHandler<DeleteRoleCommand, bool>
{
    public async Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        return await repo.DeleteRole(request.Id);
    }
}



