using CommonLib.Exceptions;

namespace BiddingService.Exceptions
{
    public class BidBadRequestException(string message) : BadRequestException("Bid", message)
    {
    }
}
