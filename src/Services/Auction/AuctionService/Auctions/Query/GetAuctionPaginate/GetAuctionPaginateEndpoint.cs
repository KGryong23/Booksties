using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.GetAuctionPaginate;
public record GetAuctionPaginateRequest(
        string? SearchTerm,
        string? FilterBy,
        string? OrderBy,
        string? Seller,
        string? Winner,
        int Limit = 4,
        int Page = 1
);
public class GetAuctionPaginateEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/paginate", async ([AsParameters] GetAuctionPaginateRequest request, ISender sender) =>
        {
            var query = request.Adapt<GetAuctionPaginateQuery>();
            var result = await sender.Send(query);
            return Results.Ok(new Response<PaginatedResult<AuctionDto>>(
                  201,
                  "Get succeed",
                  new PaginatedResult<AuctionDto>(
                      request.Page,
                      request.Limit,
                      result.Count,
                      result
                  )
            ));
        }).RequireAuthorization("view_auctions");
    }
}



