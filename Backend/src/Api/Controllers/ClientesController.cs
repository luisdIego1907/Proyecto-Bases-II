using Api.Mappers;
using Api.Models.Clientes;
using Api.Security;
using Facade.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly IClienteFacade _clienteFacade;

    public ClientesController(IClienteFacade clienteFacade)
    {
        _clienteFacade = clienteFacade;
    }

    [Authorize(Policy = AuthorizationPolicies.CanReadClients)]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClienteResponseModel>>> Listar(
        CancellationToken cancellationToken)
    {
        var clientes = await _clienteFacade.ListarAsync(cancellationToken);

        return Ok(clientes.Select(ClienteApiMapper.ToModel).ToList());
    }

    [Authorize(Policy = AuthorizationPolicies.CanCreateClients)]
    [HttpPost]
    public async Task<ActionResult<ClienteResponseModel>> Crear(
        [FromBody] CrearClienteRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = ClienteApiMapper.ToDto(request);

            var cliente = await _clienteFacade.CrearAsync(dto, cancellationToken);

            if (cliente is null)
            {
                return BadRequest(new { mensaje = "No se pudo crear el cliente." });
            }

            return Ok(ClienteApiMapper.ToModel(cliente));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanUpdateClients)]
    [HttpPut("{clienteResourceId:guid}")]
    public async Task<ActionResult<ClienteResponseModel>> Modificar(
        Guid clienteResourceId,
        [FromBody] ModificarClienteRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = ClienteApiMapper.ToDto(request);

            var cliente = await _clienteFacade.ModificarAsync(
                clienteResourceId,
                dto,
                cancellationToken);

            if (cliente is null)
            {
                return NotFound(new { mensaje = "Cliente no encontrado." });
            }

            return Ok(ClienteApiMapper.ToModel(cliente));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanDeleteClients)]
    [HttpDelete("{clienteResourceId:guid}")]
    public async Task<IActionResult> Eliminar(
        Guid clienteResourceId,
        CancellationToken cancellationToken)
    {
        try
        {
            await _clienteFacade.EliminarAsync(clienteResourceId, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }
}
