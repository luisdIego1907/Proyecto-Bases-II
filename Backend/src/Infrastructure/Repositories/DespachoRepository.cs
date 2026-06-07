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
        return await _context.Database
            .SqlQuery<CrearDespachoResult>($"""
                CALL sp_CrearDespacho(
                    {clienteId},
                    {usuarioId}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AgregarProductoCarritoResult?> AgregarProductoCarritoAsync(
        int despachoId,
        int productoId,
        int cantidadSolicitada,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<AgregarProductoCarritoResult>($"""
                CALL sp_AgregarProductoCarrito(
                    {despachoId},
                    {productoId},
                    {cantidadSolicitada}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ProcesarDespachoResult?> ProcesarAsync(
        int despachoId,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<ProcesarDespachoResult>($"""
                CALL sp_ProcesarDespacho(
                    {despachoId},
                    {usuarioId}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<DespachoResumenResult>($"CALL sp_ListarDespachosUltimaSemana()")
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarPorFechaAsync(
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<DespachoResumenResult>($"""
                CALL sp_ListarDespachosPorFecha(
                    {fechaInicio},
                    {fechaFin}
                )
                """)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DetalleDespachoResult>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<DetalleDespachoResult>($"""
                CALL sp_VerDetalleDespacho({despachoId})
                """)
            .ToListAsync(cancellationToken);
    }
}
