namespace IdentityService.Roles.Command.AddPermissionToRole;
public record AddPermissionToRoleRequest(
   Guid RoleId,
   List<Guid> PermissionIds
);
public class AddPermissionToRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/Role/permission", async (AddPermissionToRoleRequest request, ISender sender) =>
        {
            var command = request.Adapt<AddPermissionToRoleCommand>();
            var result = await sender.Send(command);
            if (result) return new Response<bool>(
                            201,
                            "Add successed",
                            result
                        );
            else return new Response<bool>(
                    301,
                    "Add failed",
                    result
                );
        });
    }
}



