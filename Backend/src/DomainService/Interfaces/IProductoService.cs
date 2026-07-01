using Infrastructure.Repositories.Results;

namespace DomainService.Interfaces;

public interface IProductoService
{
     Task<IReadOnlyList<InventarioProductoResult>> ListarInventarioAsync(
        CancellationToken cancellationToken = default);

    Task<ProductoDetalleResult?> IngresarAsync(
        string codigo,
        string nombre,
        string? detalle,
        int stockCritico,
        string bodega,
        string pasillo,
        string estante,
        CancellationToken cancellationToken = default);

    Task<ProductoDetalleResult?> ModificarAsync(
        Guid productoResourceId,
        string nombre,
        int stockCritico,
        Guid ubicacionResourceId,
        CancellationToken cancellationToken = default);

    Task EliminarAsync(
        Guid productoResourceId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MovimientoProductoResult>> ListarMovimientosAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default);
    
    Task<ProductoDetalleResult?> ObtenerPorIdAsync(
    int productoId,
    CancellationToken cancellationToken = default);
}
