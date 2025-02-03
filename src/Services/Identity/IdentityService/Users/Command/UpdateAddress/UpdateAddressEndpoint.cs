namespace IdentityService.Users.Command.UpdateAddress;
public record UpdateAddressRequest(
      Guid Id,
      string Address
);
public class UpdateAddressEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/User/address", async (UpdateAddressRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateAddressCommand>();
            var result = await sender.Send(command);
            return Results.Ok(new Response<bool>(
                201,
                "Update success",
                result
            ));
        }).RequireAuthorization();
    }
}



