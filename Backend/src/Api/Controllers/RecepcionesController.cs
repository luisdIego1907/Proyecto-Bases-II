using Api.Mappers;
using Api.Models.Recepciones;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/recepciones")]
public class RecepcionesController : ControllerBase
{
    private readonly IRecepcionFacade _recepcionFacade;

    public RecepcionesController(IRecepcionFacade recepcionFacade)
    {
        _recepcionFacade = recepcionFacade;
    }

    [HttpPost]
    public async Task<ActionResult<RegistrarRecepcionResponseModel>> Registrar(
        [FromBody] RegistrarRecepcionRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = RecepcionApiMapper.ToDto(request);

            var recepcion = await _recepcionFacade.RegistrarAsync(
                dto,
                cancellationToken);

            if (recepcion is null)
            {
                return BadRequest(new { mensaje = "No se pudo registrar la recepción." });
            }

            return Ok(RecepcionApiMapper.ToModel(recepcion));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpGet("producto/{productoId:int}")]
    public async Task<ActionResult<IReadOnlyList<RecepcionProductoResponseModel>>> ListarPorProducto(
        int productoId,
        CancellationToken cancellationToken)
    {
        try
        {
            var recepciones = await _recepcionFacade.ListarPorProductoAsync(
                productoId,
                cancellationToken);

            return Ok(recepciones.Select(RecepcionApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }
}
