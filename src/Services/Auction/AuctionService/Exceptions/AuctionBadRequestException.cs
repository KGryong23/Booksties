using CommonLib.Exceptions;

namespace AuctionService.Exceptions
{
    public class AuctionBadRequestException(string message) : BadRequestException("User", message)
    {
    }
}
