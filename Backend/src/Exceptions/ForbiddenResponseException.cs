namespace Exceptions;

public class ForbiddenResponseException : MessageException
{
    public ForbiddenResponseException()
        : base("Forbidden access")
    {
        
    }

    public ForbiddenResponseException(string message)
        : base(message)
    {
        
    }

    public ForbiddenResponseException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

}
