namespace Dto;

public class AuthorizationResponseDto
{
     public required string BearerToken { get; set; }

    public required DateTime ExpiresIn { get; set; }
}
