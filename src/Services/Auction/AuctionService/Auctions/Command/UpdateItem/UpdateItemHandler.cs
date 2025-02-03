using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.UpdateItem;
public record UpdateItemCommand(
    Guid Id,
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string Description
) : ICommand<bool>;
public class UpdateItemHandler(IAuctionRepository repo) : ICommandHandler<UpdateItemCommand, bool>
{
    public async Task<bool> Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);

        if (auction == null) return false;

        auction.Item.Title = request.Title;
        auction.Item.Author = request.Author;
        auction.Item.Publisher = request.Publisher;
        auction.Item.Year = request.Year;
        auction.Item.PageCount = request.PageCount;
        auction.Item.Description = request.Description;

        return await repo.SaveChangesAsync(cancellationToken);
    }
}



