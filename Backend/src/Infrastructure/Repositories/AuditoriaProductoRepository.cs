using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AuditoriaProductoRepository : IAuditoriaProductoRepository
{
    private readonly AppDbContext _context;

    public AuditoriaProductoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<AuditoriaProductoResult>> ListarPorProductoAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<AuditoriaProductoResult>()
            .FromSqlInterpolated($"""
                CALL sp_ListarAuditoriaProducto(
                    {productoId},
                    {fechaInicio},
                    {fechaFin}
                )
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}