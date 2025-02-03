using AuctionService.Entities;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.UpdateStatus;
public record UpdateStatusCommand(
    Guid Id,
    string Status
)
 : ICommand<bool>;
public class UpdateStatusHandler
(IAuctionRepository repo)
 : ICommandHandler<UpdateStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateStatusCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (
            auction == null ||
            auction.Status == AuctionStatus.Finished ||
            auction.Status == AuctionStatus.ReserveNotMet ||
            auction.Status == AuctionStatus.Live
        ) return false;
        if (Enum.TryParse<AuctionStatus>(request.Status, out var status) && Enum.IsDefined(typeof(AuctionStatus), status))
        {
            auction.Status = status;
        }
        else
        {
            return false;
        }
        return await repo.SaveChangesAsync(cancellationToken);
    }
}



