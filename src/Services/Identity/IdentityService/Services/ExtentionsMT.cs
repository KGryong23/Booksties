using System.Reflection;
using IdentityService.Consumers;
using MassTransit;

namespace IdentityService.Services;

public static class ExtentionsMT
{
    public static IServiceCollection AddMessageBroker
         (this IServiceCollection services, IConfiguration configuration, Assembly? assembly = null)
    {
        services.AddMassTransit(config =>
        {
            config.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("identitys", false));

            if (assembly != null)
                config.AddConsumers(assembly);

            config.UsingRabbitMq((context, configurator) =>
            {
                configurator.Host(new Uri(configuration["MessageBroker:Host"]!), host =>
                {
                    host.Username(configuration["MessageBroker:UserName"]!);
                    host.Password(configuration["MessageBroker:Password"]!);
                });

                configurator.ReceiveEndpoint("identitys-pay-order-queue", endpoint =>
                {
                    endpoint.Bind("identitys", x =>
                    {
                        x.RoutingKey = "identitys-pay-order";
                        x.ExchangeType = "direct";
                    });

                    endpoint.ConfigureConsumer<PayOrderConsumer>(context);
                });

                configurator.ReceiveEndpoint("identitys-refund-transaction-queue", endpoint =>
                {
                    endpoint.Bind("identitys", x =>
                    {
                        x.RoutingKey = "identitys-refund-transaction";
                        x.ExchangeType = "direct";
                    });

                    endpoint.ConfigureConsumer<RefundTransactionConsumer>(context);
                });

                configurator.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}
