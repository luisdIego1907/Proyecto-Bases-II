using Api.Mappers;
using Api.Models.Clientes;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly IClienteFacade _clienteFacade;

    public ClientesController(IClienteFacade clienteFacade)
    {
        _clienteFacade = clienteFacade;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClienteResponseModel>>> Listar(
        CancellationToken cancellationToken)
    {
        var clientes = await _clienteFacade.ListarAsync(cancellationToken);

        return Ok(clientes.Select(ClienteApiMapper.ToModel).ToList());
    }

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
