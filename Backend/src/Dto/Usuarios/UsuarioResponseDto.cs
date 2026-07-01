namespace Dto.Usuario_Roles;

public class UsuarioResponseDto
{
    public int UsuarioId { get; set; }

    public Guid UsuarioResourceId { get; set; }

    public string NombreUsuario { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public string Apellidos { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public bool Activo { get; set; }
}
