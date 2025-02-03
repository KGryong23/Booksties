using CommonLib.Messaging.Events;
using MassTransit;

namespace IdentityService.Consumers;

public class PayOrderConsumer
  (IWalletRepository walletRepository, ILogger<PayOrderConsumer> logger)
  : IConsumer<PayOrder>
{
    public async Task Consume(ConsumeContext<PayOrder> context)
    {
        logger.LogInformation("--> Consuming pay order");
        var result = await walletRepository.PayOrder(context.Message.UserId, context.Message.OrderAmount, context.Message.Description ?? "Thanh toán");
        if (result == true)
        {
            logger.LogInformation("--> Pay order succeed");
        }
        else
        {
            logger.LogInformation("--> Pay order failed");
        }
    }
}


