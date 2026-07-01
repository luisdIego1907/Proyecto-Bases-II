using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class DespachoRepository : IDespachoRepository
{
    private readonly AppDbContext _context;

    public DespachoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CrearDespachoResult?> CrearAsync(
        int clienteId,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Set<CrearDespachoResult>()
            .FromSqlInterpolated($"""
                CALL sp_CrearDespacho(
                    {clienteId},
                    {usuarioId}
                )
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task<AgregarProductoCarritoResult?> AgregarProductoCarritoAsync(
        int despachoId,
        int productoId,
        int cantidadSolicitada,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Set<AgregarProductoCarritoResult>()
            .FromSqlInterpolated($"""
                CALL sp_AgregarProductoCarrito(
                    {despachoId},
                    {productoId},
                    {cantidadSolicitada}
                )
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task<ProcesarDespachoResult?> ProcesarAsync(
        int despachoId,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Set<ProcesarDespachoResult>()
            .FromSqlInterpolated($"""
                CALL sp_ProcesarDespacho(
                    {despachoId},
                    {usuarioId}
                )
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DespachoResumenResult>()
            .FromSqlInterpolated($"CALL sp_ListarDespachosUltimaSemana()")
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarPorFechaAsync(
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DespachoResumenResult>()
            .FromSqlInterpolated($"""
                CALL sp_ListarDespachosPorFecha(
                    {fechaInicio},
                    {fechaFin}
                )
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DetalleDespachoResult>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DetalleDespachoResult>()
            .FromSqlInterpolated($"""
                CALL sp_VerDetalleDespacho({despachoId})
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<CarritoDespachoResult>> VerCarritoAsync(int despachoId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<CarritoDespachoResult>()
       .FromSqlInterpolated($"""
            CALL sp_VerCarritoDespacho({despachoId})
            """)
       .AsNoTracking()
       .ToListAsync(cancellationToken);
    }
}