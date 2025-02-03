using System.Text.Json;
using AuctionService.Data;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;
using AuctionService.Services;
using BiddingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Npgsql;
using Polly;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var assembly = typeof(Program).Assembly;

builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssembly(assembly);
    config.AddOpenBehavior(typeof(CommandValidationBehavior<,>));
    config.AddOpenBehavior(typeof(QueryValidationBehavior<,>));
    config.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

builder.Services.AddValidatorsFromAssembly(assembly);

builder.Services.AddControllers()
       .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

builder.Services.AddCarter();

builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

builder.Services.AddCustomJwtAuthentication(builder.Configuration);

builder.Services.AddAuthorization(AuthorizationPolicies.AddPolicies);

builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

builder.Services.AddMessageBroker(builder.Configuration, assembly);

builder.Services.AddExceptionHandler<CustomExceptionHandler>();

MappingConfig.RegisterMappings();

builder.Services.AddGrpcClient<GrpcBid.GrpcBidClient>(options =>
{
    options.Address = new Uri(builder.Configuration["GrpcSettings:BidUrl"]!);
});

builder.Services.AddGrpc();

builder.Services.AddHostedService<CheckAuctionFinished>();

var app = builder.Build();

app.MapCarter();

app.UseExceptionHandler(options => { });

app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<GrpcAuctionService>();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/images"
});

var retryPolicy = Policy
    .Handle<NpgsqlException>()
    .WaitAndRetry(5, retryAttempt => TimeSpan.FromSeconds(5));

retryPolicy.ExecuteAndCapture(() => DbInitializer.InitDb(app));

app.Run();
