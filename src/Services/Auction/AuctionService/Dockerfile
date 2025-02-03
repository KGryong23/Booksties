FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

RUN mkdir -p /app/Images && chmod -R 777 /app/Images

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["src/Services/Auction/AuctionService/AuctionService.csproj", "src/Services/Auction/AuctionService/"]
COPY ["src/CommonLib/CommonLib/CommonLib.csproj", "src/CommonLib/CommonLib/"]
COPY ["src/CommonLib/CommonLib.Messaging/CommonLib.Messaging.csproj", "src/CommonLib/CommonLib.Messaging/"]
RUN dotnet restore "src/Services/Auction/AuctionService/AuctionService.csproj"
COPY . .
WORKDIR "/src/src/Services/Auction/AuctionService"
RUN dotnet build "AuctionService.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "AuctionService.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY ["src/Services/Auction/AuctionService/Images", "/app/Images"]
ENTRYPOINT ["dotnet", "AuctionService.dll"]
