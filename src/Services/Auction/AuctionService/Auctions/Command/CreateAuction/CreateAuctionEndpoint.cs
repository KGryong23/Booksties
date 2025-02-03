using Microsoft.AspNetCore.Routing.Matching;

namespace AuctionService.Auctions.Command.CreateAuction;
public record CreateAuctionRequest(
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string ImageUrl,
    string? Description,
    decimal ReservePrice,
    Guid SellerId,
    string Seller,
    string? SellerAddress
);
public record CreateAuctionResponse(bool Status);
public class CreateAuctionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/Auction/add", async (CreateAuctionRequest request, ISender sender) =>
        {
            var command = request.Adapt<CreateAuctionCommand>();
            var result = await sender.Send(command);
            if (result.Status == 0)
            {
                return Results.Ok(new Response<int>(201, "Add succeed", result.Status));
            }
            else if (result.Status == 1)
            {
                return Results.Ok(new Response<int>(301, "Bạn chỉ được tạo 3 phiên trong 1 ngày", result.Status));
            }
            return Results.Ok(new Response<int>(301, "Add failed", result.Status));
        }).RequireAuthorization();
    }
}



