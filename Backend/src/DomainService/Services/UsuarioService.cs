using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class UsuarioService : IUsuarioService
{
     private readonly IUsuarioRepository _usuarioRepository;

    public UsuarioService(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    public async Task<IReadOnlyList<UsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        return await _usuarioRepository.ListarAsync(cancellationToken);
    }

    public async Task<UsuarioResult?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        if (usuarioResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del usuario es obligatorio.");
        }

        return await _usuarioRepository.ObtenerPorResourceIdAsync(
            usuarioResourceId,
            cancellationToken);
    }

    public async Task<IReadOnlyList<string>> ListarRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        if (usuarioResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del usuario es obligatorio.");
        }

        var roles = await _usuarioRepository.ListarRolesAsync(
            usuarioResourceId,
            cancellationToken);

        return roles.Select(r => r.Nombre).ToList();
    }
}
