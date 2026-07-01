using Api.Models.Authentication;
using Dto;

namespace Api.Mappers;

public class AuthenticationApiMapper
{
    public static AuthorizationRequestDto ToDto(LoginRequestModel model)
    {
        return new AuthorizationRequestDto
        {
            Username = model.NombreUsuario,
            Password = model.Contrasena
        };
    }

    public static LoginResponseModel ToModel(AuthorizationResponseDto dto)
    {
        return new LoginResponseModel
        {
            BearerToken = dto.BearerToken,
            ExpiresIn = dto.ExpiresIn
        };
    }
}
