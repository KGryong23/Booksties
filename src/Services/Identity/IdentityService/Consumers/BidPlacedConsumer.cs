using CommonLib.Messaging.Events;
using MassTransit;

namespace IdentityService.Consumers;

public class BidPlacedConsumer
  (IWalletRepository walletRepository, ILogger<BidPlacedConsumer> logger)
 : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        logger.LogInformation("--> Consuming bid placed");
        var result = await walletRepository.PayOrder(
            context.Message.BidderId,
            context.Message.Amount,
            "Đặt giá thầu"
        );
        if (result == true)
        {
            logger.LogInformation("--> Bid placed succeed");
        }
        else
        {
            logger.LogInformation("--> Bid placed failed");
        }
    }
}


