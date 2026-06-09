namespace Exceptions;

public class DatabaseOperationException : MessageException
{
    public DatabaseOperationException()
        : base("Database operation failed")
    {
    }

    public DatabaseOperationException(string message)
        : base(message)
    {
    }

    public DatabaseOperationException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
