namespace Exceptions;

public class UnauthorizedResponseException : MessageException
{
    public UnauthorizedResponseException()
        : base("Unauthorized access")
    {
    }

    public UnauthorizedResponseException(string message)
        : base(message)
    {
    }

    public UnauthorizedResponseException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

}
