using IdentityService.Dtos.UserNameDto;

namespace IdentityService.Users.Query.GetUserName;

public class GetUserNameEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.Map("/api/v1/User/email/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetUserNameQuery(id));
            return Results.Ok(new Response<UserNameDto?>(
                201,
                "Get success",
                result
            ));
        });
    }
}



