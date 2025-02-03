using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Query.UserLogin
{
    public class UserLoginEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/signin", async (UserLoginReq request, ISender sender) =>
            {
                var query = request.Adapt<UserLoginQuery>();
                var result = await sender.Send(query);
                if (result.User is null)
                    return Results.Ok(new Response<UserLoginRes>(
                        301,
                        "Email or password incorrect",
                        result
                ));
                return Results.Ok(new Response<UserLoginRes>(
                        201,
                        "Signin success",
                        result
                ));
            });
        }
    }
}



