using System.Reflection;
using MassTransit;

namespace BiddingService.Services;

public static class ExtentionsMT
{
    public static IServiceCollection AddMessageBroker
         (this IServiceCollection services, IConfiguration configuration, Assembly? assembly = null)
    {
        services.AddMassTransit(config =>
        {
            config.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("bids", false));

            if (assembly != null)
                config.AddConsumers(assembly);

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


