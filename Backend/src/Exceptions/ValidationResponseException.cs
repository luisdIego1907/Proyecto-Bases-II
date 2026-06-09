namespace Exceptions;

public class ValidationResponseException : MessageException
{
    public ValidationResponseException()
        : base("Validation error")
    {
    }

    public ValidationResponseException(string message)
        : base(message)
    {
    }

    public ValidationResponseException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
