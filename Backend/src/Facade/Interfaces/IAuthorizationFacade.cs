using Dto;

namespace Facade.Interfaces;

public interface IAuthorizationFacade
{
    Task<AuthorizationResponseDto> AuthorizeAsync(AuthorizationRequestDto request);
}
