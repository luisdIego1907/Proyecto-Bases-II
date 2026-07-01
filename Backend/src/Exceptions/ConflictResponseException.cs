namespace Exceptions;

public class ConflictResponseException : MessageException
{
     public ConflictResponseException()
        : base("Resource conflict")
    {
    }

    public ConflictResponseException(string message)
        : base(message)
    {
    }

    public ConflictResponseException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}

