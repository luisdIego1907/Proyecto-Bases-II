namespace Exceptions;

public class BusinessRuleException : MessageException
{
     public BusinessRuleException()
        : base("Business rule violation")
    {
    }

    public BusinessRuleException(string message)
        : base(message)
    {
    }

    public BusinessRuleException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
