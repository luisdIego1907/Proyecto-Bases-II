namespace Infrastructure.Repositories.Results;

public class DetalleDespachoResult
{
     public int DespachoId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Producto { get; set; } = string.Empty;

    public int CantidadDespachada { get; set; }
}
