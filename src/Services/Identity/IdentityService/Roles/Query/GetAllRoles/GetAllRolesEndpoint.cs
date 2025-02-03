using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Roles.Query;

public class GetAllRolesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/Role/all", async (ISender sender) =>
        {
            var result = await sender.Send(new GetAllRolesQuery());
            return new Response<IEnumerable<RoleDto>>(
                201,
                "Get success",
                result
            );
        });
    }
}


