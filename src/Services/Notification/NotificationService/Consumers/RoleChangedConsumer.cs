using CommonLib.Messaging.Events;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class RoleChangedConsumer
(IHubContext<NotificationHub> hubContext)
 : IConsumer<RoleChanged>
{
    public async Task Consume(ConsumeContext<RoleChanged> context)
    {
        Console.WriteLine("==> Role changed message received");

        await hubContext.Clients.All.SendAsync("RoleChanged", context.Message);
    }
}


