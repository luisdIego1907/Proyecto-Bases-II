namespace Exceptions;

public class ResourceNotFoundException : MessageException
{
    public ResourceNotFoundException()
        : base("Resource not found")
    {
        
    }
    public ResourceNotFoundException(string Message) 
        : base(Message)
    {
    }

    public ResourceNotFoundException(string message, Exception innerException)
        : base(message , innerException)
    {
        
    }

}
