namespace CommonLib.Responses
{
    public record Response<T>
    (
        int code,
        string message,
        T data
    );
}


