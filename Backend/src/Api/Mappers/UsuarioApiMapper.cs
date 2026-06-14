using Api.Models.Usuarios;
using Dto.Usuario_Roles;

namespace Api.Mappers;

public class UsuarioApiMapper
{
     public static UsuarioResponseModel ToModel(UsuarioResponseDto dto)
    {
        return new UsuarioResponseModel
        {
            UsuarioId = dto.UsuarioId,
            UsuarioResourceId = dto.UsuarioResourceId,
            NombreUsuario = dto.NombreUsuario,
            Nombre = dto.Nombre,
            Apellidos = dto.Apellidos,
            Correo = dto.Correo,
            Activo = dto.Activo
        };
    }

    public static UsuarioRolesResponseModel ToModel(UsuarioRolesResponseDto dto)
    {
        return new UsuarioRolesResponseModel
        {
            Roles = dto.Roles
        };
    }

    public static RolUsuarioResponseModel ToModel(RolUsuarioResponseDto dto)
    {
        return new RolUsuarioResponseModel
        {
            RolUsuarioId = dto.RolUsuarioId,
            RolUsuarioResourceId = dto.RolUsuarioResourceId,
            Nombre = dto.Nombre
        };
    }
}
