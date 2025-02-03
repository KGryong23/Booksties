using System.Text.Json;
using AuctionService;
using BiddingService.Data;
using BiddingService.Repositories;
using BiddingService.RequestHelpers;
using BiddingService.Services;
using IdentityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BidDbContext>(opt =>
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

builder.Services.AddScoped<IBidRepository, BidRepository>();

builder.Services.AddCustomJwtAuthentication(builder.Configuration);

builder.Services.AddAuthorization(AuthorizationPolicies.AddPolicies);

builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

builder.Services.AddMessageBroker(builder.Configuration, assembly);

builder.Services.AddExceptionHandler<CustomExceptionHandler>();

MappingConfig.RegisterMappings();

builder.Services.AddGrpcClient<GrpcAuction.GrpcAuctionClient>(options =>
{
    options.Address = new Uri(builder.Configuration["GrpcSettings:AuctionUrl"]!);
});

builder.Services.AddGrpcClient<GrpcWalletBalance.GrpcWalletBalanceClient>(options =>
{
    options.Address = new Uri(builder.Configuration["GrpcSettings:IdentityUrl"]!);
});

builder.Services.AddGrpc();

var app = builder.Build();

app.MapCarter();

app.UseExceptionHandler(options => { });

app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<GrpcBidService>();

app.Run();
