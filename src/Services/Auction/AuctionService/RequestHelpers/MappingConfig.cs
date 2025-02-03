using AuctionService.DTOs;
using AuctionService.Entities;
using BiddingService;

namespace AuctionService.RequestHelpers;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Auction, AuctionDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString())
            .Map(dest => dest.Title, src => src.Item.Title)
            .Map(dest => dest.Author, src => src.Item.Author)
            .Map(dest => dest.Publisher, src => src.Item.Publisher)
            .Map(dest => dest.Year, src => src.Item.Year)
            .Map(dest => dest.PageCount, src => src.Item.PageCount)
            .Map(dest => dest.ImageUrl, src => src.Item.ImageUrl)
            .Map(dest => dest.Description, src => src.Item.Description);

        TypeAdapterConfig<CreateAuctionDto, Auction>
            .NewConfig()
            .Map(dest => dest.ReservePrice, src => src.ReservePrice)
            .Map(dest => dest.SellerId, src => src.SellerId)
            .Map(dest => dest.Seller, src => src.Seller)
            .Map(dest => dest.SellerAddress, src => src.SellerAddress)
            .Map(dest => dest.AuctionEnd, src => src.AuctionEnd)
            .Map(dest => dest.Status, src => AuctionStatus.Pending)
            .Map(dest => dest.Item, src => new Item
            {
                Title = src.Title,
                Author = src.Author,
                Publisher = src.Publisher,
                Year = src.Year,
                PageCount = src.PageCount,
                ImageUrl = src.ImageUrl,
                Description = src.Description
            });
        TypeAdapterConfig<AuctionDto, GrpcAuctionResponse>
            .NewConfig()
            .Map(dest => dest.Auction.Id, src => src.Id)
            .Map(dest => dest.Auction.SellerId, src => src.SellerId.ToString())
            .Map(dest => dest.Auction.ReservePrice, src => src.ReservePrice.ToString())
            .Map(dest => dest.Auction.CurrentHighBid, src => src.CurrentHighBid.ToString())
            .Map(dest => dest.Auction.AuctionEnd, src => src.AuctionEnd)
            .Map(dest => dest.Auction.Status, src => src.Status);

        TypeAdapterConfig<GrpcHighBidResponse, HighBidDto>
            .NewConfig()
            .Map(dest => dest.BidderId, src => Guid.Parse(src.Bid.BidderId))
            .Map(dest => dest.Bidder, src => src.Bid.Bidder)
            .Map(dest => dest.Amount, src => decimal.Parse(src.Bid.Amount))
            .Map(dest => dest.Status, src => src.Bid.Status);

        TypeAdapterConfig<Auction, AuctionWinnerDto>
            .NewConfig()
            .Map(dest => dest.Title, src => src.Item.Title)
            .Map(dest => dest.Author, src => src.Item.Author)
            .Map(dest => dest.Publisher, src => src.Item.Publisher)
            .Map(dest => dest.Year, src => src.Item.Year)
            .Map(dest => dest.PageCount, src => src.Item.PageCount)
            .Map(dest => dest.ImageUrl, src => src.Item.ImageUrl)
            .Map(dest => dest.Description, src => src.Item.Description)
            .Map(dest => dest.TransactionStatus, src => src.Transaction.TransactionStatus.ToString())
            .Map(dest => dest.ShippingAddress, src => src.Transaction.ShippingAddress);
    }
}


