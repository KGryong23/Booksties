namespace IdentityService.Roles.Command.CreateRole;
public record CreateRoleRequest(
    string RoleName
);
public class CreateRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/Role/add", async (CreateRoleRequest request, ISender sender) =>
        {
            var command = request.Adapt<CreateRoleCommand>();
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



