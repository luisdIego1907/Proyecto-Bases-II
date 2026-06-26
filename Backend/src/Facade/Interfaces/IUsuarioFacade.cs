using Domain.Entities;
using Dto;
using Dto.Usuario_Roles;

namespace Facade.Interfaces;

public interface IUsuarioFacade
{
    Task<IReadOnlyList<UsuarioResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default);

    Task<UsuarioResponseDto?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);

    Task<UsuarioRolesResponseDto?> ObtenerRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default);

}
