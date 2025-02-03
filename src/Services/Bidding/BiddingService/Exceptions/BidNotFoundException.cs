using CommonLib.Exceptions;
namespace BiddingService.Exceptions
{
    public class BidNotFoundException(Guid Id) : NotFoundException("Bid", Id)
    {
    }
}
