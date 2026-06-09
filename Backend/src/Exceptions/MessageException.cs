namespace Exceptions;

public abstract class MessageException : Exception
{
    protected MessageException(string Message) : base(Message)
    {
        
    }

    protected MessageException(string message , Exception innerException) : base(message , innerException)
    {
        
    }
}
