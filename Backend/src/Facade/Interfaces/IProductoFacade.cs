using Dto;

namespace Facade.Interfaces;

public interface IProductoFacade
{
     Task<IReadOnlyList<InventarioProductoResponseDto>> ListarInventarioAsync(
        CancellationToken cancellationToken = default);

    Task<ProductoDetalleResponseDto?> IngresarAsync(
        IngresarProductoRequestDto request,
        CancellationToken cancellationToken = default);

    Task<ProductoDetalleResponseDto?> ModificarAsync(
        Guid productoResourceId,
        ModificarProductoRequestDto request,
        CancellationToken cancellationToken = default);

    Task EliminarAsync(
        Guid productoResourceId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MovimientoProductoResponseDto>> ListarMovimientosAsync(
        int productoId,
        RangoFechaRequestDto request,
        CancellationToken cancellationToken = default);
}
