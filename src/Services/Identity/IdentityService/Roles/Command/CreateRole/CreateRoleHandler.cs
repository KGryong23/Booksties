namespace IdentityService.Roles.Command.CreateRole;
public record CreateRoleCommand
(
    string RoleName
)
 : ICommand<bool>;
public class CreateRoleHandler
(IRoleRepository repo)
 : ICommandHandler<CreateRoleCommand, bool>
{
    public async Task<bool> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        return await repo.AddRole(request.RoleName);
    }
}



