using MassTransit;
using NotificationService.Hubs;

var builder = WebApplication.CreateBuilder(args);

var assembly = typeof(Program).Assembly;

builder.Services.AddMassTransit(config =>
{
    config.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("notification", false));

    if (assembly != null)
        config.AddConsumers(assembly);

    config.UsingRabbitMq((context, configurator) =>
    {
        configurator.Host(new Uri(builder.Configuration["MessageBroker:Host"]!), host =>
        {
            host.Username(builder.Configuration["MessageBroker:UserName"]!);
            host.Password(builder.Configuration["MessageBroker:Password"]!);
        });
        configurator.ConfigureEndpoints(context);
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationHub>("/notifications");

app.Run();
