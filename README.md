# Booksties

protoc --go_out=paths=source_relative:pd --go-grpc_out=paths=source_relative:pd \*.proto

dotnet new web -o src/Services/Auction/AuctionService

dotnet sln remove Auction Services\Auction\AuctionService\AuctionService.csproj
