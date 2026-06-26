namespace Api.Models.Authentication;

public class LoginResponseModel
{
     public string BearerToken { get; set; } = string.Empty;

    public DateTime ExpiresIn { get; set; }
}
