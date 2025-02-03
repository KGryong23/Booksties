FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["src/Services/Notification/NotificationService/NotificationService.csproj", "src/Services/Notification/NotificationService/"]
COPY ["src/CommonLib/CommonLib.Messaging/CommonLib.Messaging.csproj", "src/CommonLib/CommonLib.Messaging/"]
RUN dotnet restore "src/Services/Notification/NotificationService/NotificationService.csproj"
COPY . .
WORKDIR "/src/src/Services/Notification/NotificationService"
RUN dotnet build "NotificationService.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "NotificationService.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.dll"]
