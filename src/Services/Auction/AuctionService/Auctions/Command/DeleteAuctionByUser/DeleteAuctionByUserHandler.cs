using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.DeleteAuctionByUser;
public record DeleteAuctionByUserCommand(
    Guid Id
) : ICommand<bool>;
public class DeleteAuctionByUserHandler(IAuctionRepository repo) : ICommandHandler<DeleteAuctionByUserCommand, bool>
{
    public async Task<bool> Handle(DeleteAuctionByUserCommand request, CancellationToken cancellationToken)
    {
        var auction = await repo.GetAuctionEntityByIdAsync(request.Id, cancellationToken);
        if (auction == null) return false;
        var latestAuction = await repo.GetLatestAuctionBySeller(auction.SellerId);
        if (latestAuction == null) return false;
        var oneHourAgo = DateTime.UtcNow.AddMinutes(-5);
        if (latestAuction.CreatedAt > oneHourAgo)
        {
            return false;
        }
        repo.RemoveAuction(auction);
        var result = await repo.SaveChangesAsync(cancellationToken);
        if (result)
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Images");
            var fileName = Path.GetFileName(auction.Item.ImageUrl);
            var filePath = Path.Combine(uploadPath, fileName);

            var fullPath = Path.GetFullPath(filePath);
            if (!fullPath.StartsWith(uploadPath))
            {
                Console.WriteLine("Invalid file path. Operation aborted.");
                return false;
            }

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                Console.WriteLine($"File deleted: {fullPath}");
            }
            else
            {
                Console.WriteLine("File not found. No action taken.");
            }
        }
        return result;
    }
}



