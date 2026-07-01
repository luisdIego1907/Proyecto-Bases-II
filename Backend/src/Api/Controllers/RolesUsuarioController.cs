using Api.Mappers;
using Api.Models.Usuarios;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/roles-usuario")]
public class RolesUsuarioController : ControllerBase
{
    private readonly IRolUsuarioFacade _rolUsuarioFacade;

    public RolesUsuarioController(IRolUsuarioFacade rolUsuarioFacade)
    {
        _rolUsuarioFacade = rolUsuarioFacade;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RolUsuarioResponseModel>>> Listar(
        CancellationToken cancellationToken)
    {
        var roles = await _rolUsuarioFacade.ListarAsync(cancellationToken);

        return Ok(roles.Select(UsuarioApiMapper.ToModel).ToList());
    }
}
