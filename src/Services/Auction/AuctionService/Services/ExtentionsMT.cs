using System.Reflection;
using AuctionService.Data;
using MassTransit;

namespace AuctionService.Services;

public static class ExtentionsMT
{
    public static IServiceCollection AddMessageBroker
          (this IServiceCollection services, IConfiguration configuration, Assembly? assembly = null)
    {
        services.AddMassTransit(config =>
        {
            // config.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
            // {
            //     o.QueryDelay = TimeSpan.FromMinutes(2);
            //     o.UsePostgres();
            //     o.UseBusOutbox();
            // });

            if (assembly != null)
                config.AddConsumers(assembly);

            config.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auctions", false));

            config.UsingRabbitMq((context, configurator) =>
            {
                configurator.Host(new Uri(configuration["MessageBroker:Host"]!), host =>
                {
                    host.Username(configuration["MessageBroker:UserName"]!);
                    host.Password(configuration["MessageBroker:Password"]!);
                });
                configurator.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}


