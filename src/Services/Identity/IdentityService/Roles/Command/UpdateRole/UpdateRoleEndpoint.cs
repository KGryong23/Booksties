namespace IdentityService.Roles.Command.UpdateRole;
public record UpdateRoleRequest(
    Guid Id,
    string RoleName
);
public class UpdateRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/Role/update", async (UpdateRoleRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateRoleCommand>();
            var result = await sender.Send(command);
            if (result) return new Response<bool>(
                            201,
                            "Update successed",
                            result
                        );
            else return new Response<bool>(
                    301,
                    "Update failed",
                    result
                );
        });
    }
}



