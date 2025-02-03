using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.DeleteAuction;
public record DeleteAuctionCommand(
    Guid Id
) : ICommand<bool>;
public class DeleteAuctionHandler(IAuctionRepository repo) : ICommandHandler<DeleteAuctionCommand, bool>
{
    public async Task<bool> Handle(DeleteAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        repo.RemoveAuction(auction);
        return await repo.SaveChangesAsync(cancellationToken);
    }
}



