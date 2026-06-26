using Domain.Entities;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<UsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<UsuarioResult>()
            .FromSqlInterpolated($"CALL sp_ListarUsuarios()")
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<UsuarioResult?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Set<UsuarioResult>()
            .FromSqlInterpolated($"""
                CALL sp_ObtenerUsuarioPorResourceId({usuarioResourceId.ToString()})
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return resultado.FirstOrDefault();
    }

    public async Task<IReadOnlyList<UsuarioRolResult>> ListarRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<UsuarioRolResult>()
            .FromSqlInterpolated($"""
                CALL sp_ListarRolesPorUsuarioResourceId({usuarioResourceId.ToString()})
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public Task<Usuario?> GetByUsernameAsync(string username)
    {
        return _context.Usuarios
            .Include(u => u.UsuarioRoles)
            .ThenInclude(ur => ur.RolUsuario)
            .FirstOrDefaultAsync(u => u.NombreUsuario == username);
    }
}
