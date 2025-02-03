namespace AuctionService.Auctions.Command.UpdateStatusBySeller;
public record UpdateStatusBySellerRequest(
    Guid Id,
    string Status
);
public class UpdateStatusBySellerEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update/status/seller", async (UpdateStatusBySellerRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateStatusBySellerCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(
                    201,
                    "Update status success",
                    result
                ));
            }
            else
            {
                return Results.Ok(new Response<bool>(
                    301,
                    "Update status failed",
                    result
                ));
            }
        }).RequireAuthorization();
    }
}






