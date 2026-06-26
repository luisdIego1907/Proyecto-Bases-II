using Domain.Entities;
using Infrastructure.Repositories.Results;

namespace Infrastructure.Repositories.Interfaces;

public interface IUsuarioRepository
{
     Task<IReadOnlyList<UsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default);

    Task<UsuarioResult?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<UsuarioRolResult>> ListarRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);

    Task<Usuario?> GetByUsernameAsync(string username);
}
