using IdentityService.Dtos.PermissionDtos;

namespace IdentityService.Roles.Query.GetUnassignedPermissionsForRole;

public class GetUnassignedPermissionsForRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/Permission/not/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetUnassignedPermissionsForRoleQuery(id));
            return new Response<IEnumerable<PermissionDto>>(
                201,
                "Get success",
                result
            );
        });
    }
}



