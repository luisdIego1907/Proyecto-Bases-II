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
        return await _context.Set<InventarioProductoResult>()
            .FromSqlInterpolated($"CALL sp_ListarInventario()")
            .AsNoTracking()
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
        var resultado = await _context.Set<ProductoDetalleResult>()
            .FromSqlInterpolated($"""
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
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task<ProductoDetalleResult?> ModificarAsync(
    Guid productoResourceId,
    string nombre,
    int stockCritico,
    Guid ubicacionResourceId,
    CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Set<ProductoDetalleResult>()
            .FromSqlInterpolated($"""
            CALL sp_ModificarProducto(
                {productoResourceId.ToString()},
                {nombre},
                {stockCritico},
                {ubicacionResourceId.ToString()}
            )
            """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task EliminarAsync(
        Guid productoResourceId,
    CancellationToken cancellationToken = default)
{
    await _context.Database.ExecuteSqlInterpolatedAsync($"""
        CALL sp_EliminarProducto({productoResourceId.ToString()})
        """,
        cancellationToken);
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
