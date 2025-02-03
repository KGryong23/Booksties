using System.Security.Claims;

namespace BiddingService.Bids.Command.PlaceBid;
public record PlaceBidRequest(
   Guid AuctionId,
   string Bidder,
   decimal Amount
);
public class PlaceBidEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.Map("api/v1/Bid", async (PlaceBidRequest request, ISender sender, HttpContext httpContext) =>
        {
            var id = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(id))
            {
                return Results.Unauthorized();
            }
            var result = await sender.Send(new PlaceBidCommand(
                request.AuctionId,
                Guid.Parse(id),
                request.Bidder,
                request.Amount
            ));
            return Results.Ok(result);
        }).RequireAuthorization();
    }
}



