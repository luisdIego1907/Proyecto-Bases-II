using DomainService.Interfaces;
using Dto.Usuario_Roles;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class RolUsuarioFacade : IRolUsuarioFacade
{
    private readonly IRolUsuarioService _rolUsuarioService;

    public RolUsuarioFacade(IRolUsuarioService rolUsuarioService)
    {
        _rolUsuarioService = rolUsuarioService;
    }

    public async Task<IReadOnlyList<RolUsuarioResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        var roles = await _rolUsuarioService.ListarAsync(cancellationToken);

        return roles
            .Select(UsuarioMapper.ToResponseDto)
            .ToList();
    }
}
