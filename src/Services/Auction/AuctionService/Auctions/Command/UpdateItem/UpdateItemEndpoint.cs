namespace AuctionService.Auctions.Command.UpdateItem;
public record UpdateItemRequest(
    Guid Id,
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string Description
);
public class UpdateItemEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/update", async (UpdateItemRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateItemCommand>();
            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new Response<bool>(201, "Update item succeed", result));
            }
            return Results.Ok(new Response<bool>(301, "Update item failed", result));
        }).RequireAuthorization();
    }
}



