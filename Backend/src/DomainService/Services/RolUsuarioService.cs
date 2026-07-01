using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class RolUsuarioService : IRolUsuarioService
{
    private readonly IRolUsuarioRepository _rolUsuarioRepository;

    public RolUsuarioService(IRolUsuarioRepository rolUsuarioRepository)
    {
        _rolUsuarioRepository = rolUsuarioRepository;
    }

    public async Task<IReadOnlyList<RolUsuarioResult>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        return await _rolUsuarioRepository.ListarAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<string>> ListarPorUsuarioResourceIdAsync(
    Guid usuarioResourceId,
    CancellationToken cancellationToken = default)
    {
        var roles = await _rolUsuarioRepository.ListarPorUsuarioResourceIdAsync(
            usuarioResourceId,
            cancellationToken);

        return roles
            .Select(r => r.Nombre)
            .ToList();
    }
}
