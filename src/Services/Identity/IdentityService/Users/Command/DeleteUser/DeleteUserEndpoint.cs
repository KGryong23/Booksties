namespace IdentityService.Users.Command.DeleteUser
{
    public class DeleteUserEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("api/v1/User/delete/{id}", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new DeleteUserCommand(id));
                if (result.Status is true)
                    return new Response<bool>(
                        201,
                        "Delete success",
                        result.Status
                    );
                return new Response<bool>(
                        301,
                        "Delete failed",
                        result.Status
                    );
            }).RequireAuthorization();
        }
    }
}

