using Dto.Usuario_Roles;
using Infrastructure.Repositories.Results;

namespace Facade.Mappers;

public static class UsuarioMapper
{
     public static UsuarioResponseDto ToResponseDto(UsuarioResult usuario)
    {
        return new UsuarioResponseDto
        {
            UsuarioId = usuario.UsuarioId,
            UsuarioResourceId = usuario.UsuarioResourceId,
            NombreUsuario = usuario.NombreUsuario,
            Nombre = usuario.Nombre,
            Apellidos = usuario.Apellidos,
            Correo = usuario.Correo,
            Activo = usuario.Activo
        };
    }

    public static UsuarioRolesResponseDto ToRolesResponseDto(
        IReadOnlyList<string> roles)
    {
        return new UsuarioRolesResponseDto
        {
            Roles = roles.ToList()
        };
    }

    public static RolUsuarioResponseDto ToResponseDto(RolUsuarioResult rol)
    {
        return new RolUsuarioResponseDto
        {
            RolUsuarioId = rol.RolUsuarioId,
            RolUsuarioResourceId = rol.RolUsuarioResourceId,
            Nombre = rol.Nombre
        };
    }
}
