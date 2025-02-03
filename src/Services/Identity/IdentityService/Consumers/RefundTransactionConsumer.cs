using CommonLib.Messaging.Events;
using MassTransit;

namespace IdentityService.Consumers;

public class RefundTransactionConsumer
   (IWalletRepository walletRepository, ILogger<RefundTransactionConsumer> logger)
 : IConsumer<RefundTransaction>
{
    public async Task Consume(ConsumeContext<RefundTransaction> context)
    {
        logger.LogInformation("--> Consuming refund transaction");
        var result = await walletRepository.RefundTransaction(context.Message.UserId, context.Message.RefundAmount, context.Message.Description ?? "Hoàn tiền");
        if (result == true)
        {
            logger.LogInformation("--> Refund transaction succeed");
        }
        else
        {
            logger.LogInformation("--> Refund transaction failed");
        }
    }
}


