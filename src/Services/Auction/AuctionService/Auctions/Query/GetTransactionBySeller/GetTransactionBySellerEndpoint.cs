namespace AuctionService.Auctions.Query.GetTransactionBySeller;

public class GetTransactionBySellerEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/transaction/{id}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetTransactionBySellerQuery(id));
            return Results.Ok(new Response<GetTransactionBySellerResult?>(201, "Get succeed", result));
        });
    }
}



