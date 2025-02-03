using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.Repositories;

namespace AuctionService.Auctions.Command.CreateAuction;
public record CreateAuctionCommand(
    string Title,
    string Author,
    string Publisher,
    int Year,
    int PageCount,
    string ImageUrl,
    string? Description,
    decimal ReservePrice,
    Guid SellerId,
    string Seller,
    string? SellerAddress
) : ICommand<CreateAuctionResult>;
public record CreateAuctionResult(int Status);
public class CreateAuctionHandler(IAuctionRepository repo)
 : ICommandHandler<CreateAuctionCommand, CreateAuctionResult>
{
    public async Task<CreateAuctionResult> Handle(CreateAuctionCommand request, CancellationToken cancellationToken)
    {
        var auctionsCount = await repo.GetAuctionsCountForToday(request.SellerId);
        if (auctionsCount >= 3)
        {
            DeleteImageIfExists(request.ImageUrl);
            return new CreateAuctionResult(1);
        }

        var dto = request.Adapt<CreateAuctionDto>();
        var auction = dto.Adapt<Auction>();
        auction.AuctionEnd = DateTime.UtcNow.AddDays(3);

        repo.AddAuction(auction);
        var saveResult = await repo.SaveChangesAsync(cancellationToken);

        if (!saveResult && !string.IsNullOrEmpty(request.ImageUrl))
        {
            DeleteImageIfExists(request.ImageUrl);
            return new CreateAuctionResult(3);
        }

        return new CreateAuctionResult(saveResult ? 0 : 3);
    }

    private void DeleteImageIfExists(string? imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
            return;

        try
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Images");
            var fileName = Path.GetFileName(imageUrl);
            var filePath = Path.Combine(uploadPath, fileName);

            var fullPath = Path.GetFullPath(filePath);
            if (!fullPath.StartsWith(uploadPath))
            {
                Console.WriteLine("Invalid file path. Operation aborted.");
                return;
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
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting file: {ex.Message}");
        }
    }

}


