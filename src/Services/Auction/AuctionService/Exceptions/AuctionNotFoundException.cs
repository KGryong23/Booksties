using CommonLib.Exceptions;
namespace AuctionService.Exceptions
{
    public class AuctionNotFoundException(Guid Id) : NotFoundException("User", Id)
    {
    }
}
