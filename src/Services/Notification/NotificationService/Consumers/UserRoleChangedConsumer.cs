using CommonLib.Messaging.Events;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class UserRoleChangedConsumer
(IHubContext<NotificationHub> hubContext)
 : IConsumer<UserRoleChanged>
{
    public async Task Consume(ConsumeContext<UserRoleChanged> context)
    {
        Console.WriteLine("==> User role changed message received");

        await hubContext.Clients.All.SendAsync("UserRoleChanged", context.Message);
    }
}


