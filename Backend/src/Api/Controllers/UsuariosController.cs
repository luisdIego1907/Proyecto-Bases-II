using Api.Mappers;
using Api.Models.Usuarios;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
     private readonly IUsuarioFacade _usuarioFacade;

    public UsuariosController(IUsuarioFacade usuarioFacade)
    {
        _usuarioFacade = usuarioFacade;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UsuarioResponseModel>>> Listar(
        CancellationToken cancellationToken)
    {
        var usuarios = await _usuarioFacade.ListarAsync(cancellationToken);

        return Ok(usuarios.Select(UsuarioApiMapper.ToModel).ToList());
    }

    [HttpGet("{usuarioResourceId:guid}")]
    public async Task<ActionResult<UsuarioResponseModel>> ObtenerPorResourceId(
        Guid usuarioResourceId,
        CancellationToken cancellationToken)
    {
        var usuario = await _usuarioFacade.ObtenerPorResourceIdAsync(
            usuarioResourceId,
            cancellationToken);

        if (usuario is null)
        {
            return NotFound(new { mensaje = "Usuario no encontrado." });
        }

        return Ok(UsuarioApiMapper.ToModel(usuario));
    }

    [HttpGet("{usuarioResourceId:guid}/roles")]
    public async Task<ActionResult<UsuarioRolesResponseModel>> ObtenerRoles(
        Guid usuarioResourceId,
        CancellationToken cancellationToken)
    {
        var roles = await _usuarioFacade.ObtenerRolesAsync(
            usuarioResourceId,
            cancellationToken);

        if (roles is null)
        {
            return NotFound(new { mensaje = "Usuario no encontrado." });
        }

        return Ok(UsuarioApiMapper.ToModel(roles));
    }
}
