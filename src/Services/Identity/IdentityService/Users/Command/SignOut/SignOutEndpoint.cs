namespace IdentityService.Users.Command.SignOut
{
    public class SignOutEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/signout/{id}", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new SignOutCommand(id));
                if (result == false)
                    return Results.Ok(new Response<bool>(
                        301,
                        "Signout failed",
                        result
                    ));
                return Results.Ok(new Response<bool>(
                        201,
                        "Signout success",
                        result
                    ));
            }).RequireAuthorization();
        }
    }
}



