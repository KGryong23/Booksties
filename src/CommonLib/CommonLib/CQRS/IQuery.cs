using MediatR;
namespace CommonLib.CQRS
{
    public interface IQuery<out TResponse> : IRequest<TResponse>
    {
    }
}
