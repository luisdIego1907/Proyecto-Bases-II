using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class RecepcionRepository : IRecepcionRepository
{
     private readonly AppDbContext _context;

    public RecepcionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RegistrarRecepcionResult?> RegistrarAsync(
        int productoId,
        int cantidad,
        int clienteId,
        string numeroLote,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<RegistrarRecepcionResult>($"""
                CALL sp_RegistrarRecepcion(
                    {productoId},
                    {cantidad},
                    {clienteId},
                    {numeroLote},
                    {usuarioId}
                )
                """)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RecepcionProductoResult>> ListarPorProductoAsync(
        int productoId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Database
            .SqlQuery<RecepcionProductoResult>($"""
                CALL sp_ListarRecepcionesPorProducto({productoId})
                """)
            .ToListAsync(cancellationToken);
    }
}
