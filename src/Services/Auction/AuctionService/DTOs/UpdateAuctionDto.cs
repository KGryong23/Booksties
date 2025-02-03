namespace AuctionService.DTOs;

public record UpdateItemDto(
    string? Title,
    string? Author,
    string? Publisher,
    int Year,
    int PageCount,
    string? Description
);



