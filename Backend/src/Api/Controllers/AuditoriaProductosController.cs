using Api.Mappers;
using Api.Models.Auditorias;
using Api.Models.Common;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/auditoria-productos")]
public class AuditoriaProductosController : ControllerBase
{
    private readonly IAuditoriaProductoFacade _auditoriaProductoFacade;

    public AuditoriaProductosController(
        IAuditoriaProductoFacade auditoriaProductoFacade)
    {
        _auditoriaProductoFacade = auditoriaProductoFacade;
    }

    [HttpPost("producto/{productoId:int}")]
    public async Task<ActionResult<IReadOnlyList<AuditoriaProductoResponseModel>>> ListarPorProducto(
        int productoId,
        [FromBody] RangoFechaRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = CommonApiMapper.ToDto(request);

            var auditorias = await _auditoriaProductoFacade.ListarPorProductoAsync(
                productoId,
                dto,
                cancellationToken);

            return Ok(auditorias.Select(AuditoriaProductoApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }
}
