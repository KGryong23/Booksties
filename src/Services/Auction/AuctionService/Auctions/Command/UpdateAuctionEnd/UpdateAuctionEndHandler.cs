using AuctionService.Entities;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.UpdateAuctionEnd;
public record UpdateAuctionEndCommand(
   Guid Id,
   DateTime Time
) : ICommand<bool>;
public class UpdateAuctionEndHandler
(IAuctionRepository repo)
 : ICommandHandler<UpdateAuctionEndCommand, bool>
{
    public async Task<bool> Handle(UpdateAuctionEndCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null || auction.Status == AuctionStatus.Finished || auction.Status == AuctionStatus.ReserveNotMet)
            return false;
        var requestTimeUtc = request.Time.ToUniversalTime();
        if (requestTimeUtc < auction.AuctionEnd) return false;
        auction.AuctionEnd = requestTimeUtc;
        return await repo.SaveChangesAsync(cancellationToken);
    }
}


