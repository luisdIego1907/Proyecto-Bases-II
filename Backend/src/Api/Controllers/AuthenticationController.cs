using Api.Mappers;
using Api.Models.Authentication;
using Facade.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
      private readonly IAuthorizationFacade _authorizationFacade;

    public AuthenticationController(IAuthorizationFacade authorizationFacade)
    {
        _authorizationFacade = authorizationFacade;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseModel>> Login(
        [FromBody] LoginRequestModel request)
    {
        try
        {
            var dto = AuthenticationApiMapper.ToDto(request);

            var resultado = await _authorizationFacade.AuthorizeAsync(dto);

            return Ok(AuthenticationApiMapper.ToModel(resultado));
        }
        catch (Exception ex)
        {
            return Unauthorized(new
            {
                mensaje = ex.InnerException?.Message ?? ex.Message
            });
        }
    }
}
