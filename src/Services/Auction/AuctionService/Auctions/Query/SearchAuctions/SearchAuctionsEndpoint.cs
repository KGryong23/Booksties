using AuctionService.DTOs;

namespace AuctionService.Auctions.Query.SearchAuctions;
public record SearchAuctionsRequest(
        string? SearchTerm,
        string? FilterBy,
        string? OrderBy,
        string? Seller,
        string? Winner,
        int Limit = 4,
        int Page = 1
);
public class SearchAuctionsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/search", async ([AsParameters] SearchAuctionsRequest request, ISender sender) =>
        {
            var query = request.Adapt<SearchAuctionsQuery>();
            var result = await sender.Send(query);
            return Results.Ok(new Response<PaginatedResult<AuctionDto>>(
                  201,
                  "Search succeed",
                  new PaginatedResult<AuctionDto>(
                      request.Page,
                      request.Limit,
                      result.Count,
                      result
                  )
            ));
        });
    }
}

