using Infrastructure.Repositories.Results;

namespace DomainService.Interfaces;

public interface IRolUsuarioService
{
     Task<IReadOnlyList<RolUsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default);
}
