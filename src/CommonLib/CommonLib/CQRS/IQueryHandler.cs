using MediatR;
namespace CommonLib.CQRS
{
    public interface IQueryHandler<in IQuery, TResponse> : IRequestHandler<IQuery, TResponse>
        where IQuery : IQuery<TResponse>
    {
    }
}
