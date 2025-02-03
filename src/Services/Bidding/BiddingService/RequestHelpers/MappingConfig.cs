using AuctionService;
using BiddingService.DTOs;
using BiddingService.Entities;
using CommonLib.Messaging.Events;

namespace BiddingService.RequestHelpers;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Bid, BidDto>
            .NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.AuctionId, src => src.AuctionId)
            .Map(dest => dest.Bidder, src => src.Bidder)
            .Map(dest => dest.Amount, src => src.Amount)
            .Map(dest => dest.Status, src => src.Status.ToString())
            .Map(dest => dest.CreatedAt, src => src.CreatedAt);

        TypeAdapterConfig<GrpcAuctionResponse, AuctionDto>
            .NewConfig()
            .Map(dest => dest.Id, src => Guid.Parse(src.Auction.Id))
            .Map(dest => dest.ReservePrice, src => src.Auction.ReservePrice != "" ? decimal.Parse(src.Auction.ReservePrice) : 0)
            .Map(dest => dest.SellerId, src => Guid.Parse(src.Auction.SellerId))
            .Map(dest => dest.CurrentHighBid, src => src.Auction.CurrentHighBid != "" ? decimal.Parse(src.Auction.CurrentHighBid) : 0)
            .Map(dest => dest.AuctionEnd, src => src.Auction.AuctionEnd)
            .Map(dest => dest.Status, src => src.Auction.Status);

        TypeAdapterConfig<Bid, BidPlaced>
            .NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.AuctionId, src => src.AuctionId)
            .Map(dest => dest.BidderId, src => src.BidderId)
            .Map(dest => dest.Bidder, src => src.Bidder)
            .Map(dest => dest.Amount, src => src.Amount)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.Status, src => src.Status.ToString());

        TypeAdapterConfig<Bid, GrpcHighBidResponse>
            .NewConfig()
            .Map(dest => dest.Bid.BidderId, src => src.BidderId.ToString())
            .Map(dest => dest.Bid.Bidder, src => src.Bidder)
            .Map(dest => dest.Bid.Amount, src => src.Amount.ToString())
            .Map(dest => dest.Bid.Status, src => src.Status.ToString());
    }
}



