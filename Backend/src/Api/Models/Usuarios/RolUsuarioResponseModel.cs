namespace Api.Models.Usuarios;

public class RolUsuarioResponseModel
{
    public int RolUsuarioId { get; set; }

    public Guid RolUsuarioResourceId { get; set; }

    public string Nombre { get; set; } = string.Empty;
}
