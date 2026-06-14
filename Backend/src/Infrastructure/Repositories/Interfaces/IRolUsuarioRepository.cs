using Infrastructure.Repositories.Results;

namespace Infrastructure.Repositories.Interfaces;

public interface IRolUsuarioRepository
{
    Task<IReadOnlyList<RolUsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default);
}
