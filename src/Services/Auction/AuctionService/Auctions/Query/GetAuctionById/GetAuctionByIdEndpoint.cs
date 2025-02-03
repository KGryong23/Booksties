using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.GetAuctionById;

public class GetAuctionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetAuctionByIdQuery(Id: id));
            if (result != null)
            {
                return Results.Ok(new Response<AuctionDto>(201, "Get succeed", result));
            }
            return Results.Ok(new Response<AuctionDto?>(301, "Get failed", result));
        });
    }
}



