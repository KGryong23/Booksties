using AuctionService.DTOs;
using AuctionService.RequestHelpers;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Auctions.Query.GetAuctionBySeller;
public class GetAuctionBySellerEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/Auction/paginate/{id}", async (Guid id, [AsParameters] SearchParamsBySeller search, ISender sender) =>
        {
            var result = await sender.Send(new GetAuctionBySellerQuery(id, search));
            return Results.Ok(new Response<PaginatedResult<AuctionDto>>(
                  201,
                  "Get succeed",
                  new PaginatedResult<AuctionDto>(
                      search.Page,
                      search.Limit,
                      result.Count,
                      result
                  )
            ));
        });
    }
}



