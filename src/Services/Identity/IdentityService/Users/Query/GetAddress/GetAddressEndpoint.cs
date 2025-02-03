using IdentityService.Dtos;

namespace IdentityService.Users.Query.GetAddress;

public class GetAddressEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/v1/User/address/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetAddressQuery(id));
            return Results.Ok(new Response<AddressDto?>(
                201,
                "Get success",
                result
            ));
        });
    }
}



