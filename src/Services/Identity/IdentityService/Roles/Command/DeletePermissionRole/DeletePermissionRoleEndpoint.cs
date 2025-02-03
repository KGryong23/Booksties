namespace IdentityService.Roles.Command.DeletePermissionRole;
public record DeletePermissionRoleRequest(
     Guid RoleId,
     Guid PermissionId
);
public class DeletePermissionRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/Permission/role/delete", async (DeletePermissionRoleRequest request, ISender sender) =>
        {
            var command = request.Adapt<DeletePermissionRoleCommand>();
            var result = await sender.Send(command);
            if (result) return new Response<bool>(
                            201,
                            "Delete successed",
                            result
                        );
            else return new Response<bool>(
                    301,
                    "Delete sfailed",
                    result
                );
        });
    }
}



