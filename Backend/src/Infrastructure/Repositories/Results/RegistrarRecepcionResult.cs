namespace Infrastructure.Repositories.Results;

public class RegistrarRecepcionResult
{
    public string Mensaje { get; set; } = string.Empty;

    public int ProductoId { get; set; }

    public int CantidadIngresada { get; set; }
}
