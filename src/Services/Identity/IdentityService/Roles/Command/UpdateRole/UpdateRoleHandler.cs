namespace IdentityService.Roles.Command.UpdateRole;
public record UpdateRoleCommand(
    Guid Id,
    string RoleName
)
 : ICommand<bool>;
public class UpdateRoleHandler
(IRoleRepository repo)
 : ICommandHandler<UpdateRoleCommand, bool>
{
    public async Task<bool> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    => await repo.UpdateRole(request.Id, request.RoleName);
}



