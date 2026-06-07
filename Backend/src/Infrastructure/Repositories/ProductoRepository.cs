using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductoRepository : IProductoRepository
{
    private readonly AppDbContext _context;

    public ProductoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<InventarioProductoResult>> ListarInventarioAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<InventarioProductoResult>($"CALL sp_ListarInventario()")
            .ToListAsync(cancellationToken);
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
        return await _context.Database
            .SqlQuery<ProductoDetalleResult>($"""
                CALL sp_IngresarProducto(
                    {codigo},
                    {nombre},
                    {detalle},
                    {stockCritico},
                    {bodega},
                    {pasillo},
                    {estante}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ProductoDetalleResult?> ModificarAsync(
        Guid productoResourceId,
        string nombre,
        int stockCritico,
        Guid ubicacionResourceId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<ProductoDetalleResult>($"""
                CALL sp_ModificarProducto(
                    {productoResourceId.ToString()},
                    {nombre},
                    {stockCritico},
                    {ubicacionResourceId.ToString()}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task EliminarAsync(
        Guid productoResourceId,
        CancellationToken cancellationToken = default)
    {
        await _context.Database
            .SqlQuery<MensajeResult>($"CALL sp_EliminarProducto({productoResourceId.ToString()})")
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MovimientoProductoResult>> ListarMovimientosAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<MovimientoProductoResult>($"""
                CALL sp_ListarMovimientosProducto(
                    {productoId},
                    {fechaInicio},
                    {fechaFin}
                )
                """)
            .ToListAsync(cancellationToken);
    }
}
