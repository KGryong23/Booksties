namespace CommonLib.Responses
{
    public record PaginatedResult<TEntity>
    (
        int pageIndex,
        int pageSize,
        int count,
        IEnumerable<TEntity> items
    );
}


