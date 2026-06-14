namespace Infrastructure.Repositories.Results;

public class RolUsuarioResult
{
    public int RolUsuarioId { get; set; }

    public Guid RolUsuarioResourceId { get; set; }

    public string Nombre { get; set; } = string.Empty;
}
