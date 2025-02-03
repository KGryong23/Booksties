using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetService<AuctionDbContext>()
            ?? throw new InvalidOperationException("Failed to retrieve AuctionDbContext from the service provider.");

        SeedData(context);
    }

    private static void SeedData(AuctionDbContext context)
    {
        context.Database.Migrate();

        if (context.Auctions.Any())
        {
            Console.WriteLine("Already have data - no seeding required");
            return;
        }

        var auctions = new List<Auction>()
        {
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 30000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(15),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Publisher = "Charles Scribner's Sons",
                    Year = 1925,
                    PageCount = 218,
                    ImageUrl = "a37086c5-7ddb-4058-8414-fa6b8b5fb559.jpg",
                    Description = "A classic novel of the Jazz Age, exploring themes of wealth, love, and the American Dream."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 35000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(25),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "1984",
                    Author = "George Orwell",
                    Publisher = "Secker & Warburg",
                    Year = 1949,
                    PageCount = 328,
                    ImageUrl = "b8cb4d6d-4008-4587-a62e-975d53535c78.jpg",
                    Description = "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 45000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(10),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Publisher = "J.B. Lippincott & Co.",
                    Year = 1960,
                    PageCount = 281,
                    ImageUrl = "cddb73a2-fb17-491b-9cf5-860598f70aae.jpg",
                    Description = "A deeply moving novel that explores racial injustice and moral growth in the American South."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 50000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(20),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "Pride and Prejudice",
                    Author = "Jane Austen",
                    Publisher = "T. Egerton",
                    Year = 1813,
                    PageCount = 279,
                    ImageUrl = "d80b3744-9b15-4d8f-b0d4-ca18d0538016.jpg",
                    Description = "A timeless romantic novel that critiques societal expectations and explores themes of love and reputation."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 30000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(7),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "The Catcher in the Rye",
                    Author = "J.D. Salinger",
                    Publisher = "Little, Brown and Company",
                    Year = 1951,
                    PageCount = 214,
                    ImageUrl = "6cf8a1d0-e5ac-4c61-9b88-5a824512c266.jpg",
                    Description = "A coming-of-age novel that delves into themes of alienation, identity, and connection."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 55000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(12),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "Moby-Dick",
                    Author = "Herman Melville",
                    Publisher = "Harper & Brothers",
                    Year = 1851,
                    PageCount = 635,
                    ImageUrl = "6e49f3b5-a769-4ca9-adbc-30d7df08cc1e.jpg",
                    Description = "An epic tale of the pursuit of the white whale, exploring themes of revenge, obsession, and humanity."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 30000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(50),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "War and Peace",
                    Author = "Leo Tolstoy",
                    Publisher = "The Russian Messenger",
                    Year = 1869,
                    PageCount = 1225,
                    ImageUrl = "95f27fa6-373a-4008-bfb3-300e36169861.jpg",
                    Description = "A monumental novel that portrays the complexity of Russian society during the Napoleonic Wars."
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                ReservePrice = 38000,
                SellerId = Guid.Parse("a5f669aa-4332-456e-83e5-4a36eaac72b1"),
                Seller = "test2004@gmail.com",
                AuctionEnd = DateTime.UtcNow.AddDays(30),
                Status = AuctionStatus.Live,
                Transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                },
                Item = new Item
                {
                    Id = Guid.NewGuid(),
                    Title = "Brave New World",
                    Author = "Aldous Huxley",
                    Publisher = "Chatto & Windus",
                    Year = 1932,
                    PageCount = 268,
                    ImageUrl = "45601a1d-d097-4046-aba6-ef0a8925cbea.jpg",
                    Description = "A dystopian novel that explores the dangers of a technologically controlled society."
                }
            }
        };

        context.AddRange(auctions);

        context.SaveChanges();
    }
}