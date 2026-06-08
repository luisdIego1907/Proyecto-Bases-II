using DomainService.Interfaces;
using Dto;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class ProductoFacade : IProductoFacade
{
    private readonly IProductoService _productoService;

    public ProductoFacade(IProductoService productoService)
    {
        _productoService = productoService;
    }

    public async Task<IReadOnlyList<InventarioProductoResponseDto>> ListarInventarioAsync(
        CancellationToken cancellationToken = default)
    {
        var inventario = await _productoService.ListarInventarioAsync(
            cancellationToken);

        return inventario
            .Select(ProductoMapper.ToResponseDto)
            .ToList();
    }

    public async Task<ProductoDetalleResponseDto?> IngresarAsync(
        IngresarProductoRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var producto = await _productoService.IngresarAsync(
            request.Codigo,
            request.Nombre,
            request.Detalle,
            request.StockCritico,
            request.Bodega,
            request.Pasillo,
            request.Estante,
            cancellationToken);

        return producto is null
            ? null
            : ProductoMapper.ToResponseDto(producto);
    }

    public async Task<ProductoDetalleResponseDto?> ModificarAsync(
        Guid productoResourceId,
        ModificarProductoRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var producto = await _productoService.ModificarAsync(
            productoResourceId,
            request.Nombre,
            request.StockCritico,
            request.UbicacionResourceId,
            cancellationToken);

        return producto is null
            ? null
            : ProductoMapper.ToResponseDto(producto);
    }

    public async Task EliminarAsync(
        Guid productoResourceId,
        CancellationToken cancellationToken = default)
    {
        await _productoService.EliminarAsync(
            productoResourceId,
            cancellationToken);
    }

    public async Task<IReadOnlyList<MovimientoProductoResponseDto>> ListarMovimientosAsync(
        int productoId,
        RangoFechaRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var movimientos = await _productoService.ListarMovimientosAsync(
            productoId,
            request.FechaInicio,
            request.FechaFin,
            cancellationToken);

        return movimientos
            .Select(ProductoMapper.ToResponseDto)
            .ToList();
    }
}
