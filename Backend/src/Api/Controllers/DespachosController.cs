using Api.Mappers;
using Api.Models.Common;
using Api.Models.Despachos;
using Api.Security;
using Facade.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/despachos")]
public class DespachosController : ControllerBase
{
    private readonly IDespachoFacade _despachoFacade;

    public DespachosController(IDespachoFacade despachoFacade)
    {
        _despachoFacade = despachoFacade;
    }

    [Authorize(Policy = AuthorizationPolicies.CanCreateDispatches)]
    [HttpPost]
    public async Task<ActionResult<CrearDespachoResponseModel>> Crear(
        [FromBody] CrearDespachoRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = DespachoApiMapper.ToDto(request);

            var despacho = await _despachoFacade.CrearAsync(dto, cancellationToken);

            if (despacho is null)
            {
                return BadRequest(new { mensaje = "No se pudo crear el despacho." });
            }

            return Ok(DespachoApiMapper.ToModel(despacho));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanCreateDispatches)]
    [HttpPost("carrito")]
    public async Task<ActionResult<AgregarProductoCarritoResponseModel>> AgregarProductoCarrito(
        [FromBody] AgregarProductoCarritoRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = DespachoApiMapper.ToDto(request);

            var resultado = await _despachoFacade.AgregarProductoCarritoAsync(
                dto,
                cancellationToken);

            if (resultado is null)
            {
                return BadRequest(new { mensaje = "No se pudo agregar el producto al carrito." });
            }

            return Ok(DespachoApiMapper.ToModel(resultado));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanProcessDispatches)]
    [HttpPost("procesar")]
    public async Task<ActionResult<ProcesarDespachoResponseModel>> Procesar(
        [FromBody] ProcesarDespachoRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = DespachoApiMapper.ToDto(request);

            var resultado = await _despachoFacade.ProcesarAsync(
                dto,
                cancellationToken);

            if (resultado is null)
            {
                return BadRequest(new { mensaje = "No se pudo procesar el despacho." });
            }

            return Ok(DespachoApiMapper.ToModel(resultado));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanReadDispatches)]
    [HttpGet("ultima-semana")]
    public async Task<ActionResult<IReadOnlyList<DespachoResumenResponseModel>>> ListarUltimaSemana(
       CancellationToken cancellationToken)
    {
        var despachos = await _despachoFacade.ListarUltimaSemanaAsync(cancellationToken);

        return Ok(despachos.Select(DespachoApiMapper.ToModel).ToList());
    }

    [Authorize(Policy = AuthorizationPolicies.CanReadDispatches)]
    [HttpPost("por-fecha")]
    public async Task<ActionResult<IReadOnlyList<DespachoResumenResponseModel>>> ListarPorFecha(
       [FromBody] RangoFechaRequestModel request,
       CancellationToken cancellationToken)
    {
        try
        {
            var dto = CommonApiMapper.ToDto(request);

            var despachos = await _despachoFacade.ListarPorFechaAsync(
                dto,
                cancellationToken);

            return Ok(despachos.Select(DespachoApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanReadDispatches)]
    [HttpGet("{despachoId:int}/detalle")]
    public async Task<ActionResult<IReadOnlyList<DetalleDespachoResponseModel>>> VerDetalle(
        int despachoId,
        CancellationToken cancellationToken)
    {
        try
        {
            var detalles = await _despachoFacade.VerDetalleAsync(
                despachoId,
                cancellationToken);

            return Ok(detalles.Select(DespachoApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [Authorize(Policy = AuthorizationPolicies.CanReadDispatches)]
    [HttpGet("{despachoId:int}/carrito")]
    public async Task<ActionResult<IReadOnlyList<CarritoDespachoResponseModel>>> VerCarrito(
    int despachoId,
    CancellationToken cancellationToken)
    {
        try
        {
            var carrito = await _despachoFacade.VerCarritoAsync(
                despachoId,
                cancellationToken);

            return Ok(carrito.Select(DespachoApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }
}
