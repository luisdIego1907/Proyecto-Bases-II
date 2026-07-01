using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class ProductoService : IProductoService
{
    private readonly IProductoRepository _productoRepository;

    public ProductoService(IProductoRepository productoRepository)
    {
        _productoRepository = productoRepository;
    }

    public async Task<IReadOnlyList<InventarioProductoResult>> ListarInventarioAsync(
        CancellationToken cancellationToken = default)
    {
        return await _productoRepository.ListarInventarioAsync(cancellationToken);
    }

    public async Task<ProductoDetalleResult?> IngresarAsync(
        string codigo,
        string nombre,
        string? detalle,
        int stockCritico,
        string bodega,
        string pasillo,
        string estante,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(codigo))
        {
            throw new ArgumentException("El código del producto es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ArgumentException("El nombre del producto es obligatorio.");
        }

        if (stockCritico < 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(stockCritico),
                "El stock crítico no puede ser negativo.");
        }

        if (string.IsNullOrWhiteSpace(bodega))
        {
            throw new ArgumentException("La bodega es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(pasillo))
        {
            throw new ArgumentException("El pasillo es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(estante))
        {
            throw new ArgumentException("El estante es obligatorio.");
        }

        return await _productoRepository.IngresarAsync(
            codigo.Trim(),
            nombre.Trim(),
            detalle?.Trim(),
            stockCritico,
            bodega.Trim(),
            pasillo.Trim(),
            estante.Trim(),
            cancellationToken);
    }

    public async Task<ProductoDetalleResult?> ModificarAsync(
        Guid productoResourceId,
        string nombre,
        int stockCritico,
        Guid ubicacionResourceId,
        CancellationToken cancellationToken = default)
    {
        if (productoResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del producto es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ArgumentException("El nombre del producto es obligatorio.");
        }

        if (stockCritico < 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(stockCritico),
                "El stock crítico no puede ser negativo.");
        }

        if (ubicacionResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador de ubicación es obligatorio.");
        }

        return await _productoRepository.ModificarAsync(
            productoResourceId,
            nombre.Trim(),
            stockCritico,
            ubicacionResourceId,
            cancellationToken);
    }

    public async Task EliminarAsync(
        Guid productoResourceId,
        CancellationToken cancellationToken = default)
    {
        if (productoResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del producto es obligatorio.");
        }

        await _productoRepository.EliminarAsync(productoResourceId, cancellationToken);
    }

    public async Task<IReadOnlyList<MovimientoProductoResult>> ListarMovimientosAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        if (productoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(productoId),
                "El identificador del producto debe ser mayor que cero.");
        }

        if (fechaInicio > fechaFin)
        {
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha final.");
        }

        return await _productoRepository.ListarMovimientosAsync(
            productoId,
            fechaInicio,
            fechaFin,
            cancellationToken);
    }

    public async Task<ProductoDetalleResult?> ObtenerPorIdAsync(
    int productoId,
    CancellationToken cancellationToken = default)
{
    if (productoId <= 0)
    {
        throw new ArgumentOutOfRangeException(
            nameof(productoId),
            "El identificador del producto debe ser mayor que cero.");
    }

    return await _productoRepository.ObtenerPorIdAsync(
        productoId,
        cancellationToken);
}
}
