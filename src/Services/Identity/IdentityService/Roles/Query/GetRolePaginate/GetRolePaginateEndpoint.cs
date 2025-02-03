using IdentityService.Dtos.RoleDtos;

namespace IdentityService.Roles.Query.GetRolePaginate;
public class GetRolePaginateEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/Role/paginate", async ([AsParameters] RolePaginationReq request, ISender sender) =>
        {
            var query = request.Adapt<GetRolePaginateQuery>();
            var result = await sender.Send(query);
            return Results.Ok(new Response<PaginatedResult<RolePaginateDto>>(
                201,
                "Get List Role",
                new PaginatedResult<RolePaginateDto>
                (
                     query.Page,
                     query.Limit,
                     result.Count(),
                     result
                )
            ));
        });
    }
}



