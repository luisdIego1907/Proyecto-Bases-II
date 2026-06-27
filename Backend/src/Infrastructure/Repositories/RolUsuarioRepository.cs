using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class RolUsuarioRepository : IRolUsuarioRepository
{
    private readonly AppDbContext _context;

    public RolUsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<RolUsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<RolUsuarioResult>()
            .FromSqlInterpolated($"CALL sp_ListarRolesUsuario()")
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RolUsuarioResult>> ListarPorUsuarioResourceIdAsync(
    Guid usuarioResourceId,
    CancellationToken cancellationToken = default)
    {
        return await _context.Set<RolUsuarioResult>()
            .FromSqlInterpolated($"""
            CALL sp_ListarRolesPorUsuarioResourceId({usuarioResourceId.ToString()})
        """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
