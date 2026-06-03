namespace Exceptions;

public class BadRequestResponseException : MessageException
{
    public BadRequestResponseException() : base("Invalid Request")
    {
        
    }

    public BadRequestResponseException(string message) : base(message)
    {
        
    }

    public BadRequestResponseException(string message, Exception innerException)
        : base(message, innerException)
    {
        
    }
}
