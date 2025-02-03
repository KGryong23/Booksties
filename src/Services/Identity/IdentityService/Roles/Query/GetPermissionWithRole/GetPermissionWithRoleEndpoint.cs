using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Roles.Query.GetPermissionWithRole;

public class GetPermissionWithRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/Permission/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetPermissionWithRoleQuery(id));
            return new Response<IEnumerable<PermissionDto>>(
                201,
                "Get success",
                result
            );
        });
    }
}



