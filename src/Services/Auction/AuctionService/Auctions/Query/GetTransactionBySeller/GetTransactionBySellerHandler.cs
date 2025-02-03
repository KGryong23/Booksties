using AuctionService.Repositories;

namespace AuctionService.Auctions.Query.GetTransactionBySeller;
public record GetTransactionBySellerQuery(
    Guid Id
) : IQuery<GetTransactionBySellerResult?>;
public record GetTransactionBySellerResult(
    string Status,
    string? Address
);
public class GetTransactionBySellerHandler
(IAuctionRepository repo)
 : IQueryHandler<GetTransactionBySellerQuery, GetTransactionBySellerResult?>
{
    public async Task<GetTransactionBySellerResult?> Handle(GetTransactionBySellerQuery request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return null;
        return new GetTransactionBySellerResult(auction.Transaction.TransactionStatus.ToString(), auction.Transaction.ShippingAddress);
    }
}



