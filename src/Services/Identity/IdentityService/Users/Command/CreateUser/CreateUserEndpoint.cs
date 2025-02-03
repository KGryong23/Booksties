namespace IdentityService.Users.Command.CreateUser;

public record CreateUserRequest(
        string Email,
        string Password,
        string Auth,
        string Role
);
public record CreateUserResponse(bool Status);
public class CreateUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/signup", async (CreateUserRequest request, ISender sender) =>
        {
            var command = request.Adapt<CreateUserCommand>();
            var result = await sender.Send(command);
            var response = result.Adapt<CreateUserResponse>();
            if (response.Status == true)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Save success",
                    response.Status
                ));
            }
            return Results.Ok(new Response<bool>(
                301,
                "Save failed",
                response.Status
            ));
        });
    }
}


