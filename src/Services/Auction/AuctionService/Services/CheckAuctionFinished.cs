using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.Repositories;
using BiddingService;
using CommonLib.Messaging.Events;
using MassTransit;

namespace AuctionService.Services;

public class CheckAuctionFinished(
    ILogger<CheckAuctionFinished> logger,
    IServiceProvider services,
    GrpcBid.GrpcBidClient client
) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Starting check for finished auctions");

        stoppingToken.Register(() => logger.LogInformation("==> Auction check stopping"));

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);

            await Task.Delay(20000, stoppingToken);
        }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        using var scope = services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IAuctionRepository>();

        var finishedAuctions = await repo.GetFinishedAuctionsAsync(stoppingToken);
        if (finishedAuctions.Count == 0) return;

        logger.LogInformation($"==> Found {finishedAuctions.Count} auctions that have completed");

        var auctionEvents = await ProcessAuctionsAsync(finishedAuctions, repo);

        await repo.SaveChangesAsync(stoppingToken);
        await PublishAuctionEventsAsync(auctionEvents, stoppingToken);
    }

    private async Task<List<AuctionFinished>> ProcessAuctionsAsync(List<Auction> auctions, IAuctionRepository repo)
    {
        var tasks = auctions.Select(async auction =>
        {
            var res = await client.GetHighBidAsync(new GetHighBidRequest { Id = auction.Id.ToString() }, default);

            var winningBid = res.Adapt<HighBidDto>();

            if (winningBid.Status != "NoBid" && winningBid.Amount > auction.ReservePrice)
            {
                auction.Winner = winningBid.Bidder;
                auction.WinnerId = winningBid.BidderId;
                auction.SoldAmount = winningBid.Amount;
                auction.Status = AuctionStatus.Finished;
            }
            else
            {
                auction.Status = AuctionStatus.ReserveNotMet;
            }

            return new AuctionFinished
            {
                Status = auction.Status.ToString(),
                AuctionId = auction.Id,
                Amount = winningBid?.Amount,
            };
        });

        return (await Task.WhenAll(tasks)).ToList();
    }

    private async Task PublishAuctionEventsAsync(IEnumerable<AuctionFinished> events, CancellationToken token)
    {
        using var scope = services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var auctionEvent in events)
        {
            await endpoint.Publish(auctionEvent, token);
        }
    }

}


