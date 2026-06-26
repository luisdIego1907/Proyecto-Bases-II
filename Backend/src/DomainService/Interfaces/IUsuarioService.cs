using Domain.Entities;
using Dto;
using Infrastructure.Repositories.Results;

namespace DomainService.Interfaces;

public interface IUsuarioService
{
     Task<IReadOnlyList<UsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default);

    Task<UsuarioResult?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<string>> ListarRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);
    Task<Usuario?> GetByUserAndPassword(AuthorizationRequestDto request);
}
