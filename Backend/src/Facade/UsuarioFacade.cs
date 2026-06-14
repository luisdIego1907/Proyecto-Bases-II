using DomainService.Interfaces;
using Dto.Usuario_Roles;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class UsuarioFacade : IUsuarioFacade
{
     private readonly IUsuarioService _usuarioService;

    public UsuarioFacade(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    public async Task<IReadOnlyList<UsuarioResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        var usuarios = await _usuarioService.ListarAsync(cancellationToken);

        return usuarios
            .Select(UsuarioMapper.ToResponseDto)
            .ToList();
    }

    public async Task<UsuarioResponseDto?> ObtenerPorResourceIdAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioService.ObtenerPorResourceIdAsync(
            usuarioResourceId,
            cancellationToken);

        return usuario is null
            ? null
            : UsuarioMapper.ToResponseDto(usuario);
    }

    public async Task<UsuarioRolesResponseDto?> ObtenerRolesAsync(
        Guid usuarioResourceId,
        CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioService.ObtenerPorResourceIdAsync(
            usuarioResourceId,
            cancellationToken);

        if (usuario is null)
        {
            return null;
        }

        var roles = await _usuarioService.ListarRolesAsync(
            usuarioResourceId,
            cancellationToken);

        return UsuarioMapper.ToRolesResponseDto(roles);
    }
}
