using Api.Mappers;
using Api.Models.Common;
using Api.Models.Productos;
using Facade.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController : ControllerBase
{
    private readonly IProductoFacade _productoFacade;

    public ProductosController(IProductoFacade productoFacade)
    {
        _productoFacade = productoFacade;
    }

    [HttpGet("inventario")]
    public async Task<ActionResult<IReadOnlyList<InventarioProductoResponseModel>>> ListarInventario(
        CancellationToken cancellationToken)
    {
        var inventario = await _productoFacade.ListarInventarioAsync(cancellationToken);

        return Ok(inventario.Select(ProductoApiMapper.ToModel).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<ProductoDetalleResponseModel>> Ingresar(
        [FromBody] IngresarProductoRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = ProductoApiMapper.ToDto(request);

            var producto = await _productoFacade.IngresarAsync(dto, cancellationToken);

            if (producto is null)
            {
                return BadRequest(new { mensaje = "No se pudo ingresar el producto." });
            }

            return Ok(ProductoApiMapper.ToModel(producto));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpPut("{productoResourceId:guid}")]
    public async Task<ActionResult<ProductoDetalleResponseModel>> Modificar(
        Guid productoResourceId,
        [FromBody] ModificarProductoRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = ProductoApiMapper.ToDto(request);

            var producto = await _productoFacade.ModificarAsync(
                productoResourceId,
                dto,
                cancellationToken);

            if (producto is null)
            {
                return NotFound(new { mensaje = "Producto no encontrado." });
            }

            return Ok(ProductoApiMapper.ToModel(producto));
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpDelete("{productoResourceId:guid}")]
    public async Task<IActionResult> Eliminar(
        Guid productoResourceId,
        CancellationToken cancellationToken)
    {
        try
        {
            await _productoFacade.EliminarAsync(productoResourceId, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpPost("{productoId:int}/movimientos")]
    public async Task<ActionResult<IReadOnlyList<MovimientoProductoResponseModel>>> ListarMovimientos(
        int productoId,
        [FromBody] RangoFechaRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = CommonApiMapper.ToDto(request);

            var movimientos = await _productoFacade.ListarMovimientosAsync(
                productoId,
                dto,
                cancellationToken);

            return Ok(movimientos.Select(ProductoApiMapper.ToModel).ToList());
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpGet("{productoId:int}")]
public async Task<ActionResult<ProductoDetalleResponseModel>> ObtenerPorId(
    int productoId,
    CancellationToken cancellationToken)
{
    try
    {
        var producto = await _productoFacade.ObtenerPorIdAsync(
            productoId,
            cancellationToken);

        if (producto is null)
        {
            return NotFound(new { mensaje = "Producto no encontrado." });
        }

        return Ok(ProductoApiMapper.ToModel(producto));
    }
    catch (Exception ex)
    {
        return BadRequest(new { mensaje = ex.InnerException?.Message ?? ex.Message });
    }
}
}
