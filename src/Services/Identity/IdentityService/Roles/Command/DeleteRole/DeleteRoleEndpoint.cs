namespace IdentityService.Roles.Command.DeleteRole;

public class DeleteRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/Role/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new DeleteRoleCommand(id));
            if (result) return new Response<bool>(
                            201,
                            "Delete successed",
                            result
                        );
            else return new Response<bool>(
                    301,
                    "Delete failed",
                    result
                );
        });
    }
}



