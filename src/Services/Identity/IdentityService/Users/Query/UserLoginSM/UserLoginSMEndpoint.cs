using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Query.UserLoginSM
{
    public class UserLoginSMEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/social_media", async (SocialMediaReq request, ISender sender) =>
            {
                var query = request.Adapt<UserLoginSMQuery>();
                var result = await sender.Send(query);
                if (result.User is null)
                    return Results.Ok(new Response<UserLoginRes>(
                        301,
                        "Email incorrect",
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

