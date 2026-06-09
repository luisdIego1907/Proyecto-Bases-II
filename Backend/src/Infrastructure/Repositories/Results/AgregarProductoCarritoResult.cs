namespace Infrastructure.Repositories.Results;

public class AgregarProductoCarritoResult
{
    public string Mensaje { get; set; } = string.Empty;

    public int DespachoId { get; set; }

    public int ProductoId { get; set; }

    public int CantidadAgregada { get; set; }
}
